export type ConfirmationStatus = "pending" | "confirmed" | "failed" | "not_found";

interface Receipt {
  status?: string;
}

interface TransactionLookup {
  transaction: unknown | null;
  receipt: Receipt | null;
  pendingHint?: boolean;
}

export async function waitForTransactionConfirmation(
  lookup: () => Promise<TransactionLookup>,
  attempts = 60,
  delayMs = 1_000
): Promise<ConfirmationStatus> {
  let transactionWasSeen = false;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const { transaction, receipt, pendingHint } = await lookup();
    transactionWasSeen ||= transaction !== null || pendingHint === true;
    if (receipt?.status === "0x1") return "confirmed";
    if (receipt?.status === "0x0") return "failed";
    if (attempt + 1 < attempts && delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  return transactionWasSeen ? "pending" : "not_found";
}
