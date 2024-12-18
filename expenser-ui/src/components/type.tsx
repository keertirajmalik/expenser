import { ExpensesDialog } from "@/components/expense-dialog";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/apiRequest";
import { ExpenseType } from "@/types/expenseType";
import { DataTable } from "@/components/data-table/data-table";

export default function Expense() {
  const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([]);

  useEffect(() => {
    apiRequest("/cxf/type", "GET").then(async (res: Response) => {
      const data = await res.json();
      const transformedData = data.transaction_types.map(
        (type: { id: string; name: string }) => ({
          label: type.name,
          value: type.id,
        }),
      );
      setExpenseTypes(transformedData);
    });
  }, []);

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
        <ExpensesDialog />
      </header>
      <main
        className="flex min-h-[calc(100vh-4rem)] w-full justify-center py-4"
        role="main"
      >
        <DataTable columns={columns} data={expenseTypes} />
      </main>
    </div>
  );
}
