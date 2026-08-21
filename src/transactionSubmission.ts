export function assertNoPendingTransaction(latestNonce: bigint, pendingNonce: bigint): void {
  if (pendingNonce < latestNonce) {
    throw new Error("RPC가 서로 다른 nonce 상태를 반환했습니다. 네트워크를 새로고침해 주세요.");
  }
  if (pendingNonce > latestNonce) {
    throw new Error(
      "이 지갑에서 먼저 보낸 거래가 아직 처리 중입니다. 같은 거래를 다시 보내지 말고 Chain Doctor에서 블록과 mempool 상태를 확인해 주세요."
    );
  }
}

export function assertSignedNonceReady(
  signedNonce: bigint,
  latestNonce: bigint,
  pendingNonce: bigint
): void {
  assertNoPendingTransaction(latestNonce, pendingNonce);
  if (signedNonce !== pendingNonce) {
    throw new Error("서명 후 nonce가 변경되었습니다. 이전 거래 파일을 보내지 말고 새 파일을 만들어 다시 서명해 주세요.");
  }
}

export function nonceToSafeNumber(nonce: bigint): number {
  if (nonce < 0n || nonce > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error("거래 nonce가 이 지갑에서 안전하게 처리할 수 있는 범위를 벗어났습니다.");
  }
  return Number(nonce);
}

export function assertSufficientBalance(
  balance: bigint,
  amount: bigint,
  transferCount = 1,
  feePerTransfer = 21_000n
): void {
  if (!Number.isSafeInteger(transferCount) || transferCount < 1) {
    throw new Error("전송 대상 수가 올바르지 않습니다.");
  }
  const count = BigInt(transferCount);
  const required = amount * count + feePerTransfer * count;
  if (balance < required) {
    throw new Error("잔액이 보낼 수량과 네트워크 수수료의 합보다 부족합니다.");
  }
}

export function submissionErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("이미 mempool에 있는 거래")) {
    return "동일한 거래가 이미 처리 중입니다. 다시 보내지 말고 기존 거래의 확정을 기다려 주세요.";
  }
  if (message.includes("같은 nonce 거래 교체")) {
    return "이전 거래가 아직 처리 중이라 새 거래를 보낼 수 없습니다. 수수료를 임의로 올리지 말고 Chain Doctor에서 기존 거래를 먼저 확인해 주세요.";
  }
  return String(error);
}
