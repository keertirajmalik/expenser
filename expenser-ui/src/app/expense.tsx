import { TransactionDialog } from "@/components/transaction-dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";

export default function Expense() {
  return (
    <div className="flex h-96 w-full flex-col">
      <header
        className="flex h-16 shrink-0 justify-between items-center gap-2 border-b px-4"
        role="banner"
      >
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" aria-label="Toggle sidebar" />
          <Separator
            orientation="vertical"
            className="bg-border w-px mr-2 h-4"
            decorative={true}
          />
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold">Expense</h1>
            <p className="text-sm text-gray-500">List of Your Expenses</p>
          </div>
        </div>
        <TransactionDialog />
      </header>
      <main
        className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4"
        role="main"
      >
        {" "}
        <h1 className="text-4xl font-bold" id="expense-title">
          Expense Page
        </h1>
      </main>
    </div>
  );
}
