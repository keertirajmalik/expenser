import { CreateDialog } from "@/app/create-dialog/create-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/app/expense-columns";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { apiRequest } from "@/lib/apiRequest";
import { Expense as expense } from "@/types/expense";
import { Separator } from "@radix-ui/react-separator";
import { useCallback, useEffect, useState } from "react";

const fetchExpenses = (
  setExpenses: React.Dispatch<React.SetStateAction<expense[]>>,
) => {
  apiRequest("/cxf/transaction", "GET")
    .then((response) => {
      response.json().then((data) => {
        if (Array.isArray(data.transactions)) {
          const formattedData = data.transactions.map((item: expense) => {
            return {
              id: item.id,
              name: item.name,
              type: item.type,
              amount: item.amount,
              date: item.date,
              note: item.note,
            };
          });
          setExpenses(formattedData);
        } else {
          setExpenses([]);
        }
      });
    })
    .catch(() => {
      setExpenses([]);
    });
};

export default function Expense() {
  const [expenses, setExpenses] = useState<expense[]>([]);

  const refreshExpenses = useCallback(() => {
    fetchExpenses(setExpenses);
  }, []);

  useEffect(() => {
    refreshExpenses();
  }, [refreshExpenses]);

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
        <CreateDialog
          creationType="Expense"
          title="Create Expense"
          description=" Provide information regarding expense."
          onSuccess={refreshExpenses}
        />
      </header>
      <main
        className="flex min-h-[calc(100vh-4rem)] w-full justify-center py-4"
        role="main"
      >
        <DataTable columns={columns} data={expenses} />
      </main>
    </div>
  );
}
