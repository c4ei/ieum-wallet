import { Transaction, isAddress } from "ethers";
import { CHAIN_ID } from "./wallet";

export interface OfflineUnsignedTransaction {
  chain_id: number;
  nonce: number;
  gas_price: string;
  gas_limit: number;
  to: string;
  value: string;
  data: string;
}

export interface SignedTransactionReview {
  raw: string;
  from: string;
  to: string;
  value: bigint;
  nonce: number;
  gasPrice: bigint;
  gasLimit: bigint;
}

export function createOfflineUnsignedTransaction(
  nonce: bigint,
  to: string,
  value: bigint
): OfflineUnsignedTransaction {
  if (nonce < 0n || nonce > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error("거래 순서 번호가 지원 범위를 벗어났습니다.");
  }
  if (!isAddress(to)) throw new Error("받는 주소가 올바르지 않습니다.");
  if (value <= 0n) throw new Error("보낼 수량은 0보다 커야 합니다.");
  return {
    chain_id: CHAIN_ID,
    nonce: Number(nonce),
    gas_price: "1",
    gas_limit: 21_000,
    to,
    value: value.toString(),
    data: "0x"
  };
}

export function reviewSignedTransaction(value: string): SignedTransactionReview {
  const raw = value.trim();
  if (!/^0x[0-9a-f]+$/i.test(raw) || raw.length % 2 !== 0) {
    throw new Error("서명 결과가 올바른 0x 형식이 아닙니다.");
  }
  let transaction: Transaction;
  try {
    transaction = Transaction.from(raw);
  } catch {
    throw new Error("서명된 거래를 읽을 수 없습니다.");
  }
  if (!transaction.signature || !transaction.from) {
    throw new Error("서명이 들어 있지 않은 거래입니다.");
  }
  if (transaction.type !== 0 || transaction.chainId !== BigInt(CHAIN_ID)) {
    throw new Error(`IEUM Mainnet(Chain ID ${CHAIN_ID}) legacy 거래만 전송할 수 있습니다.`);
  }
  if (!transaction.to || transaction.gasPrice === null) {
    throw new Error("받는 주소 또는 수수료가 없는 거래입니다.");
  }
  return {
    raw,
    from: transaction.from,
    to: transaction.to,
    value: transaction.value,
    nonce: transaction.nonce,
    gasPrice: transaction.gasPrice,
    gasLimit: transaction.gasLimit
  };
}

export function assertSignedTransactionMatches(
  signed: SignedTransactionReview,
  unsigned: OfflineUnsignedTransaction,
  expectedFrom: string
) {
  const matches = signed.from.toLowerCase() === expectedFrom.toLowerCase()
    && signed.to.toLowerCase() === unsigned.to.toLowerCase()
    && signed.value === BigInt(unsigned.value)
    && signed.nonce === unsigned.nonce
    && signed.gasPrice === BigInt(unsigned.gas_price)
    && signed.gasLimit === BigInt(unsigned.gas_limit);
  if (!matches) {
    throw new Error("서명 결과가 이 지갑에서 만든 거래 내용과 일치하지 않습니다.");
  }
}
