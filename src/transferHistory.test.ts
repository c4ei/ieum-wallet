import { beforeEach, describe, expect, it, vi } from "vitest";
import { loadTransferHistory, pageCount, reconcilePendingTransfers, removeTransfer, transferHistoryKey, transferPage } from "./transferHistory";

describe("최근 전송 페이징", () => {
  it("5건 단위로 마지막 페이지까지 나눈다", () => {
    const items = Array.from({ length: 12 }, (_, index) => index + 1);
    expect(pageCount(items.length)).toBe(3);
    expect(transferPage(items, 2)).toEqual([6, 7, 8, 9, 10]);
    expect(transferPage(items, 99)).toEqual([11, 12]);
  });
});

describe("로컬 전송 내역 삭제", () => {
  const address = "0x0000000000000000000000000000000000000001";
  const values = new Map<string, string>();

  beforeEach(() => {
    values.clear();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key)
    });
  });

  it("선택한 완료 내역만 삭제한다", () => {
    localStorage.setItem(transferHistoryKey(address), JSON.stringify([
      { hash: "done", to: address, amount: "1", sentAt: new Date().toISOString(), status: "confirmed" },
      { hash: "failed", to: address, amount: "2", sentAt: new Date().toISOString(), status: "failed" }
    ]));
    expect(removeTransfer(address, "done").map(item => item.hash)).toEqual(["failed"]);
  });

  it("중복 송금 방지를 위해 처리 중 내역은 유지한다", () => {
    localStorage.setItem(transferHistoryKey(address), JSON.stringify([
      { hash: "pending", to: address, amount: "1", sentAt: new Date().toISOString(), status: "pending" }
    ]));
    expect(() => removeTransfer(address, "pending")).toThrow("삭제할 수 없습니다");
    expect(loadTransferHistory(address)).toHaveLength(1);
  });
});

describe("처리 중 거래 자동 정리", () => {
  it("앱 재시작 뒤에도 영수증을 대조해 확정과 실패를 갱신한다", async () => {
    const items = [
      { hash: "0x1", to: "a", amount: "1", sentAt: "now", status: "pending" as const },
      { hash: "0x2", to: "b", amount: "2", sentAt: "now", status: "pending" as const }
    ];
    const result = await reconcilePendingTransfers(items, async hash => ({
      transaction: { hash },
      receipt: { status: hash === "0x1" ? "0x1" : "0x0" }
    }));
    expect(result.map(item => item.status)).toEqual(["confirmed", "failed"]);
  });

  it("RPC 일시 장애나 한 번 보이지 않는 거래를 임의로 실패 처리하지 않는다", async () => {
    const item = { hash: "0x1", to: "a", amount: "1", sentAt: new Date().toISOString(), status: "pending" as const };
    const missing = await reconcilePendingTransfers([item], async () => ({ transaction: null, receipt: null }));
    const outage = await reconcilePendingTransfers([item], async () => { throw new Error("offline"); });
    expect(missing[0].status).toBe("pending");
    expect(outage[0].status).toBe("pending");
  });

  it("2분 이상 된 거래가 두 번 연속 사라지면 유실 상태로 전환한다", async () => {
    const item = { hash: "0x1", to: "a", amount: "1", sentAt: new Date(Date.now() - 180_000).toISOString(), status: "pending" as const };
    const first = await reconcilePendingTransfers([item], async () => ({ transaction: null, receipt: null }));
    const second = await reconcilePendingTransfers(first, async () => ({ transaction: null, receipt: null }));
    expect(second[0].status).toBe("dropped");
  });
});
