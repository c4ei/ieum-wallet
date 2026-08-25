export type ConfirmationStatus = "pending" | "delayed" | "confirmed" | "failed" | "not_found" | "dropped";

interface Receipt {
  status?: string;
}

interface TransactionLookup {
  transaction: unknown | null;
  receipt: Receipt | null;
}

export async function waitForTransactionConfirmation(
  lookup: () => Promise<TransactionLookup>,
  attempts = 60,
  delayMs = 1_000
): Promise<ConfirmationStatus> {
  let transactionWasSeen = false;
  let consecutiveMissing = 0;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const { transaction, receipt } = await lookup();
    if (transaction !== null) {
      transactionWasSeen = true;
      consecutiveMissing = 0;
    } else if (transactionWasSeen) {
      consecutiveMissing += 1;
    }
    if (receipt?.status === "0x1") return "confirmed";
    if (receipt?.status === "0x0") return "failed";
    if (attempt + 1 < attempts && delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  if (transactionWasSeen && consecutiveMissing >= 3) return "dropped";
  return transactionWasSeen ? "delayed" : "not_found";
}
