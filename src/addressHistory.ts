export interface AddressHistoryItem {
  hash: string;
  blockHeight: number;
  sender: string;
  recipient: string;
  value: string;
  fee: string;
  nonce: number;
  timestamp: number;
  direction: "sent" | "received" | "self";
}

interface ManagerTransaction {
  hash?: unknown;
  block_height?: unknown;
  sender?: unknown;
  recipient?: unknown;
  value?: unknown;
  fee?: unknown;
  nonce?: unknown;
  timestamp?: unknown;
}

export function normalizeAddressHistory(address: string, transactions: ManagerTransaction[]): AddressHistoryItem[] {
  const own = address.toLowerCase();
  return transactions.flatMap(transaction => {
    const hash = String(transaction.hash ?? "");
    const sender = String(transaction.sender ?? "");
    const recipient = String(transaction.recipient ?? "");
    const value = String(transaction.value ?? "0");
    if (!/^0x[0-9a-f]{64}$/i.test(hash) || !/^0x[0-9a-f]{40}$/i.test(sender) || !/^0x[0-9a-f]{40}$/i.test(recipient) || !/^\d+$/.test(value)) return [];
    const sent = sender.toLowerCase() === own;
    const received = recipient.toLowerCase() === own;
    if (!sent && !received) return [];
    return [{
      hash,
      blockHeight: Number(transaction.block_height ?? 0),
      sender,
      recipient,
      value,
      fee: String(transaction.fee ?? "0"),
      nonce: Number(transaction.nonce ?? 0),
      timestamp: Number(transaction.timestamp ?? 0),
      direction: sent && received ? "self" as const : sent ? "sent" as const : "received" as const
    }];
  });
}

export function directionLabel(direction: AddressHistoryItem["direction"]): string {
  if (direction === "received") return "받음";
  if (direction === "sent") return "보냄";
  return "내 주소 이동";
}
