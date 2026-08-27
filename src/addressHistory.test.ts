import { describe, expect, it } from "vitest";
import { directionLabel, normalizeAddressHistory } from "./addressHistory";

const me = `0x${"11".repeat(20)}`;
const other = `0x${"22".repeat(20)}`;
const hash = `0x${"aa".repeat(32)}`;

describe("address history", () => {
  it("classifies received and sent on-chain transactions", () => {
    const items = normalizeAddressHistory(me, [
      { hash, block_height: 21, sender: other, recipient: me, value: "100000000000000000", fee: "21000", nonce: 0, timestamp: 1 },
      { hash: `0x${"bb".repeat(32)}`, block_height: 20, sender: me, recipient: other, value: "1", fee: "21000", nonce: 1, timestamp: 2 }
    ]);
    expect(items.map(item => item.direction)).toEqual(["received", "sent"]);
    expect(directionLabel(items[0].direction)).toBe("받음");
  });

  it("rejects malformed or unrelated manager rows", () => {
    expect(normalizeAddressHistory(me, [{ hash: "bad", sender: other, recipient: me, value: "1" }])).toEqual([]);
    expect(normalizeAddressHistory(me, [{ hash, sender: other, recipient: other, value: "1" }])).toEqual([]);
  });
});
