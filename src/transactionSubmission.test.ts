import { describe, expect, it } from "vitest";
import {
  assertNoPendingTransaction,
  assertSignedNonceReady,
  assertSufficientBalance,
  nonceToSafeNumber,
  submissionErrorMessage
} from "./transactionSubmission";

describe("거래 중복 제출 방지", () => {
  it("확정 nonce와 pending nonce가 같을 때만 새 전송을 허용한다", () => {
    expect(() => assertNoPendingTransaction(3n, 3n)).not.toThrow();
    expect(() => assertNoPendingTransaction(3n, 4n)).toThrow(/먼저 보낸 거래/);
    expect(() => assertNoPendingTransaction(4n, 3n)).toThrow(/서로 다른 nonce/);
  });

  it("mempool 중복과 nonce 교체 오류를 사용자가 이해할 문장으로 바꾼다", () => {
    expect(submissionErrorMessage(new Error("이미 mempool에 있는 거래입니다."))).toMatch(/동일한 거래/);
    expect(submissionErrorMessage(new Error("같은 nonce 거래 교체에는 기존보다 최소 10% 높은 수수료가 필요합니다."))).toMatch(/이전 거래/);
  });

  it("오프라인 서명 뒤 nonce가 달라지면 오래된 서명을 거부한다", () => {
    expect(() => assertSignedNonceReady(3n, 3n, 3n)).not.toThrow();
    expect(() => assertSignedNonceReady(3n, 4n, 4n)).toThrow(/새 파일/);
    expect(() => assertSignedNonceReady(3n, 3n, 4n)).toThrow(/먼저 보낸 거래/);
  });

  it("nonce 정밀도 손실과 수수료를 포함한 잔액 부족을 차단한다", () => {
    expect(nonceToSafeNumber(7n)).toBe(7);
    expect(() => nonceToSafeNumber(BigInt(Number.MAX_SAFE_INTEGER) + 1n)).toThrow(/안전하게/);
    expect(() => assertSufficientBalance(1_020n, 1_000n, 1, 21n)).toThrow(/잔액/);
    expect(() => assertSufficientBalance(1_021n, 1_000n, 1, 21n)).not.toThrow();
    expect(() => assertSufficientBalance(2_041n, 1_000n, 2, 21n)).toThrow(/잔액/);
  });
});
