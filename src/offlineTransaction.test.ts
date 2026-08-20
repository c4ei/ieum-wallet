import { Wallet, parseEther } from "ethers";
import { describe, expect, it } from "vitest";
import {
  assertSignedTransactionMatches,
  createOfflineUnsignedTransaction,
  reviewSignedTransaction
} from "./offlineTransaction";

const recipient = "0x1111111111111111111111111111111111111111";

describe("콜드월렛 거래 연결", () => {
  it("콜드월렛이 이해하는 snake_case JSON을 만든다", () => {
    expect(createOfflineUnsignedTransaction(7n, recipient, parseEther("1.25"))).toEqual({
      chain_id: 21004,
      nonce: 7,
      gas_price: "1",
      gas_limit: 21_000,
      to: recipient,
      value: "1250000000000000000",
      data: "0x"
    });
  });

  it("서명 결과를 복원하고 원래 거래와 대조한다", async () => {
    const wallet = new Wallet(`0x${"01".padStart(64, "0")}`);
    const unsigned = createOfflineUnsignedTransaction(3n, recipient, parseEther("2"));
    const raw = await wallet.signTransaction({
      type: 0,
      chainId: 21004,
      nonce: unsigned.nonce,
      gasPrice: BigInt(unsigned.gas_price),
      gasLimit: BigInt(unsigned.gas_limit),
      to: unsigned.to,
      value: BigInt(unsigned.value),
      data: unsigned.data
    });
    const review = reviewSignedTransaction(raw);
    expect(review.from).toBe(wallet.address);
    expect(() => assertSignedTransactionMatches(review, unsigned, wallet.address)).not.toThrow();
    expect(() => assertSignedTransactionMatches(review, { ...unsigned, nonce: 4 }, wallet.address)).toThrow();
  });

  it("잘못된 raw와 다른 체인을 거부한다", async () => {
    expect(() => reviewSignedTransaction("hello")).toThrow();
    const wallet = Wallet.createRandom();
    const raw = await wallet.signTransaction({
      type: 0, chainId: 1, nonce: 0, gasPrice: 1n, gasLimit: 21_000n,
      to: recipient, value: 1n
    });
    expect(() => reviewSignedTransaction(raw)).toThrow("Chain ID 21004");
  });
});
