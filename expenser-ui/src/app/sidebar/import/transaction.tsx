import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/transaction";
import TransactionImportPage from "./transaction-import";
import TransactionReviewPage from "./transacation-review";

type ApiTransaction = {
  name: string;
  date: string; // "11/09/2025"
  expense: boolean;
  amount: string;
};

type TransactionPageItem = {
  name: string;
  type: TransactionType;
  category: string;
  date: string;
  amount: string;
  note: string;
};

interface ImportAndReviewFlowProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function ImportAndReviewPage({
  open: importOpen,
  setOpen: setImportOpen,
}: ImportAndReviewFlowProps) {
  const [showReview, setShowReview] = useState(false);
  const [transactions, setTransactions] = useState<
    TransactionPageItem[] | null
  >(null);

  const mapApiToPageItems = (
    apiTx: ApiTransaction[],
  ): TransactionPageItem[] => {
    return apiTx.map((t) => ({
      name: t.name,
      date: t.date,
      amount: t.amount,
      type: t.expense ? TransactionType.Expense : TransactionType.Income,
      category: "Uncategorized",
      note: "",
    }));
  };

  const handleImported = (apiTx: ApiTransaction[]) => {
    const mapped = mapApiToPageItems(apiTx);
    setTransactions(mapped);
    setShowReview(true);
  };

  const handleCloseReview = () => {
    setShowReview(false);
    setImportOpen(false);
    setTransactions(null);
  };

  return (
    <>
      <TransactionImportPage
        open={importOpen}
        setOpen={setImportOpen}
        onImported={handleImported}
      />

      {showReview && transactions && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-10 right-0"
              onClick={handleCloseReview}
            >
              X
            </Button>
            <TransactionReviewPage
              transactionData={transactions}
              handleCloseReview={handleCloseReview}
            />
          </div>
        </div>
      )}
    </>
  );
}
