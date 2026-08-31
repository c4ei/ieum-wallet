import { HDNodeWallet, Mnemonic, Wallet, isAddress, parseEther } from "ethers";
import version from "../version.json";

export const CHAIN_ID = 21004;
export const APP_VERSION = version.displayVersion;
export const EXPECTED_GENESIS_HASH = "0x82cfc3615112766f3eb151a8677890c1b74ce6bce8463a1a3590991c383650f6";
export const REQUIRED_PROTOCOL_VERSION = 2;
export const HD_PATH = "m/44'/60'/0'/0/0";

export function createSeedChallenge(words: string[], randomValues?: Uint32Array): number[] {
  if (words.length !== 12) throw new Error("SEED는 12단어여야 합니다.");
  const source = randomValues ?? crypto.getRandomValues(new Uint32Array(12));
  const selected: number[] = [];
  for (const value of source) {
    const index = value % words.length;
    if (!selected.includes(index)) selected.push(index);
    if (selected.length === 3) return selected.sort((a, b) => a - b);
  }
  for (let index = 0; selected.length < 3; index += 1) {
    if (!selected.includes(index)) selected.push(index);
  }
  return selected.sort((a, b) => a - b);
}

export function verifySeedChallenge(words: string[], indices: number[], answers: string[]): boolean {
  return indices.length === 3 && answers.length === 3 && indices.every((index, position) =>
    words[index] === answers[position]?.trim().toLowerCase()
  );
}

export function unlockDelayMs(failures: number): number {
  if (failures <= 0) return 0;
  return Math.min(30_000, 1_000 * (2 ** Math.min(failures - 1, 5)));
}

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
  if (/^0x0{40}$/i.test(to)) throw new Error("0번 주소로는 보낼 수 없습니다.");
  const normalizedAmount = amount.trim();
  if (!normalizedAmount) throw new Error("보낼 IEUM 수량을 입력해 주세요.");
  let value: bigint;
  try {
    value = parseEther(normalizedAmount);
  } catch {
    throw new Error("보낼 수량은 숫자이며 소수점 이하 최대 18자리여야 합니다.");
  }
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
