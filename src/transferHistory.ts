export interface TransferHistoryItem {
  hash: string;
  to: string;
  amount: string;
  sentAt: string;
  status?: TransferStatus;
  /** 동일 거래를 새 nonce 없이 안전하게 재전파하기 위한 서명 원문입니다. */
  rawTransaction?: string;
  nonce?: string;
  missingChecks?: number;
  lastCheckedAt?: string;
}

export type TransferStatus = "pending" | "delayed" | "confirmed" | "failed" | "not_found" | "dropped";

export const TRANSFER_PAGE_SIZE = 5;

export function transferHistoryKey(address: string): string {
  return `ieum-transfer-history-${address.toLowerCase()}`;
}

export function loadTransferHistory(address: string): TransferHistoryItem[] {
  try {
    const value = JSON.parse(localStorage.getItem(transferHistoryKey(address)) ?? "[]");
    return Array.isArray(value) ? value.slice(0, 100) : [];
  } catch {
    return [];
  }
}

export function saveTransfer(address: string, item: TransferHistoryItem): TransferHistoryItem[] {
  const next = [
    { ...item, status: item.status ?? "pending" } as TransferHistoryItem,
    ...loadTransferHistory(address).filter((current) => current.hash !== item.hash)
  ].slice(0, 100);
  localStorage.setItem(transferHistoryKey(address), JSON.stringify(next));
  return next;
}

export function updateTransferStatus(
  address: string,
  hash: string,
  status: TransferStatus
): TransferHistoryItem[] {
  const next = loadTransferHistory(address).map((item) =>
    item.hash === hash ? { ...item, status } : item
  );
  localStorage.setItem(transferHistoryKey(address), JSON.stringify(next));
  return next;
}

export function storeTransferHistory(address: string, items: TransferHistoryItem[]): TransferHistoryItem[] {
  const next = items.slice(0, 100);
  localStorage.setItem(transferHistoryKey(address), JSON.stringify(next));
  return next;
}

export function removeTransfer(address: string, hash: string): TransferHistoryItem[] {
  const current = loadTransferHistory(address);
  const target = current.find((item) => item.hash === hash);
  if (target && ["pending", "delayed"].includes(target.status ?? "pending")) {
    throw new Error("처리 중이거나 확정 지연 중인 거래 내역은 삭제할 수 없습니다.");
  }
  return storeTransferHistory(address, current.filter((item) => item.hash !== hash));
}

export async function reconcilePendingTransfers(
  items: TransferHistoryItem[],
  lookup: (hash: string) => Promise<{ transaction: unknown | null; receipt: { status?: string } | null }>,
  maximum = 10
): Promise<TransferHistoryItem[]> {
  let inspected = 0;
  return Promise.all(items.map(async item => {
    if (!["pending", "delayed"].includes(item.status ?? "pending") || inspected >= maximum) return item;
    inspected += 1;
    try {
      const { transaction, receipt } = await lookup(item.hash);
      if (receipt?.status === "0x1") return { ...item, status: "confirmed" as const };
      if (receipt?.status === "0x0") return { ...item, status: "failed" as const };
      const lastCheckedAt = new Date().toISOString();
      if (transaction) {
        const age = Date.now() - Date.parse(item.sentAt);
        return {
          ...item,
          status: age >= 30_000 ? "delayed" as const : "pending" as const,
          missingChecks: 0,
          lastCheckedAt
        };
      }
      const missingChecks = (item.missingChecks ?? 0) + 1;
      const oldEnoughToClassify = Date.now() - Date.parse(item.sentAt) >= 120_000;
      return {
        ...item,
        status: oldEnoughToClassify && missingChecks >= 2 ? "dropped" as const : item.status,
        missingChecks,
        lastCheckedAt
      };
    } catch {
      return item;
    }
  }));
}

export function transferStatusLabel(status: TransferStatus | undefined): string {
  switch (status) {
    case "confirmed": return "블록 확정";
    case "failed": return "거래 실패";
    case "not_found": return "체인에서 확인되지 않음";
    case "dropped": return "네트워크에서 유실됨";
    case "delayed": return "확정 지연";
    default: return "처리 중";
  }
}

export function pageCount(total: number, pageSize = TRANSFER_PAGE_SIZE): number {
  return Math.max(1, Math.ceil(total / pageSize));
}

export function transferPage<T>(items: T[], page: number, pageSize = TRANSFER_PAGE_SIZE): T[] {
  const safePage = Math.min(Math.max(1, page), pageCount(items.length, pageSize));
  return items.slice((safePage - 1) * pageSize, safePage * pageSize);
}
