import { HDNodeWallet, Mnemonic, Wallet, isAddress, parseEther } from "ethers";

export const CHAIN_ID = 21004;
export const EXPECTED_GENESIS_HASH = "0xc7a4f99b113341db7705117dedb240bb3ea3b0b99c115d134ddf505be1ff8a5a";
export const REQUIRED_PROTOCOL_VERSION = 2;
export const HD_PATH = "m/44'/60'/0'/0/0";

export function createWallet() {
  const wallet = Wallet.createRandom();
  return {
    wallet,
    mnemonic: wallet.mnemonic?.phrase ?? "",
    privateKey: wallet.privateKey
  };
}

export function restoreFromMnemonic(words: string): HDNodeWallet {
  const phrase = words.trim().toLowerCase().replace(/\s+/g, " ");
  if (!Mnemonic.isValidMnemonic(phrase)) throw new Error("올바른 BIP-39 SEED가 아닙니다.");
  return HDNodeWallet.fromPhrase(phrase, undefined, HD_PATH);
}

export function restoreFromPrivateKey(key: string): Wallet {
  const normalized = key.trim().startsWith("0x") ? key.trim() : `0x${key.trim()}`;
  return new Wallet(normalized);
}

export function validateTransfer(to: string, amount: string) {
  if (!isAddress(to)) throw new Error("받는 주소가 올바르지 않습니다.");
  const value = parseEther(amount);
  if (value <= 0n) throw new Error("보낼 수량은 0보다 커야 합니다.");
  return value;
}

export function formatAah(value: bigint): string {
  return `${formatIeumUnits(value)} IEUM`;
}

export function formatIeumUnits(value: bigint, decimals = 18, maxFractionDigits = 8): string {
  if (!Number.isInteger(decimals) || decimals < 0) throw new Error("decimals must be a non-negative integer");
  if (!Number.isInteger(maxFractionDigits) || maxFractionDigits < 0) {
    throw new Error("maxFractionDigits must be a non-negative integer");
  }
  const negative = value < 0n;
  const absolute = negative ? -value : value;
  const shownDecimals = Math.min(decimals, maxFractionDigits);
  const discardedDecimals = decimals - shownDecimals;
  const roundingUnit = 10n ** BigInt(discardedDecimals);
  const rounded = discardedDecimals > 0
    ? (absolute + roundingUnit / 2n) / roundingUnit
    : absolute;
  const displayScale = 10n ** BigInt(shownDecimals);
  const whole = rounded / displayScale;
  const fraction = shownDecimals > 0
    ? (rounded % displayScale).toString().padStart(shownDecimals, "0").replace(/0+$/, "")
    : "";
  const groupedWhole = whole.toLocaleString("ko-KR");
  return `${negative ? "-" : ""}${groupedWhole}${fraction ? `.${fraction}` : ""}`;
}
