import { describe, expect, it } from "vitest";
import { pageCount, reconcilePendingTransfers, transferPage } from "./transferHistory";

describe("최근 전송 페이징", () => {
  it("5건 단위로 마지막 페이지까지 나눈다", () => {
    const items = Array.from({ length: 12 }, (_, index) => index + 1);
    expect(pageCount(items.length)).toBe(3);
    expect(transferPage(items, 2)).toEqual([6, 7, 8, 9, 10]);
    expect(transferPage(items, 99)).toEqual([11, 12]);
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

  it("RPC 일시 장애나 아직 보이지 않는 거래를 임의로 실패 처리하지 않는다", async () => {
    const item = { hash: "0x1", to: "a", amount: "1", sentAt: "now", status: "pending" as const };
    const missing = await reconcilePendingTransfers([item], async () => ({ transaction: null, receipt: null }));
    const outage = await reconcilePendingTransfers([item], async () => { throw new Error("offline"); });
    expect(missing[0].status).toBe("pending");
    expect(outage[0].status).toBe("pending");
  });
});
