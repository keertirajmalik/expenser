import { CreateDialog } from "@/components/create-dialog/create-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/type-columns";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { apiRequest } from "@/lib/apiRequest";
import { ExpenseType as type } from "@/types/expenseType";
import { Separator } from "@radix-ui/react-separator";
import { useCallback, useEffect, useState } from "react";

function fetchExpenseTypes(
  setExpenseTypes: React.Dispatch<React.SetStateAction<type[]>>,
) {
  apiRequest("/cxf/type", "GET").then((response) => {
    response.json().then((data) => {
      if (Array.isArray(data.transaction_types)) {
        const transformedData = data.transaction_types.map((item: type) => {
          return {
            id: item.id,
            name: item.name,
            description: item.description,
          };
        });
        setExpenseTypes(transformedData);
      }
    });
  });
}
export default function ExpenseType() {
  const [expenseTypes, setExpenseTypes] = useState<type[]>([]);

  const refreshExpenseTypes = useCallback(() => {
    fetchExpenseTypes(setExpenseTypes);
  }, []);

  useEffect(() => {
    refreshExpenseTypes();
  }, [refreshExpenseTypes]);

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
            <h1 className="text-lg font-semibold">Expense Type</h1>
            <p className="text-sm text-gray-500">List of Your Expense Types</p>
          </div>
        </div>
        <CreateDialog
          creationType="Type"
          title="Create Expense Type"
          description=" Provide information regarding expense type."
          onSuccess={refreshExpenseTypes}
        />
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
