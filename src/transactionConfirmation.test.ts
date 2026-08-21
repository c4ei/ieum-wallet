import { describe, expect, it } from "vitest";
import { waitForTransactionConfirmation } from "./transactionConfirmation";

describe("거래 확정 판정", () => {
  it("영수증 성공 전에는 완료로 표시하지 않는다", async () => {
    let calls = 0;
    const status = await waitForTransactionConfirmation(async () => {
      calls += 1;
      return calls === 2
        ? { transaction: { hash: "0x1" }, receipt: { status: "0x1" } }
        : { transaction: { hash: "0x1" }, receipt: null };
    }, 2, 0);
    expect(status).toBe("confirmed");
  });

  it("노드 어디에서도 찾지 못한 해시는 미접수로 표시한다", async () => {
    const status = await waitForTransactionConfirmation(
      async () => ({ transaction: null, receipt: null }),
      2,
      0
    );
    expect(status).toBe("not_found");
  });

  it("실패 영수증을 완료로 처리하지 않는다", async () => {
    const status = await waitForTransactionConfirmation(
      async () => ({ transaction: { hash: "0x1" }, receipt: { status: "0x0" } }),
      1,
      0
    );
    expect(status).toBe("failed");
  });

  it("노드 mempool에 있으면 조회 결과가 null이어도 대기로 표시한다", async () => {
    const status = await waitForTransactionConfirmation(
      async () => ({ transaction: null, receipt: null, pendingHint: true }),
      2,
      0
    );
    expect(status).toBe("pending");
  });
});
