import { TransactionDialog } from "@/components/transaction-dialog";

export default function Home() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <TransactionDialog />
    </div>
  );
}
