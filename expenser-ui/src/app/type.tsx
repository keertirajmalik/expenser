import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/app/type-table-columns";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { apiRequest } from "@/lib/apiRequest";
import { Separator } from "@radix-ui/react-separator";
import { CreateDialog } from "@/app/create-dialog/create-dialog";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { showToast } from "@/lib/showToast";
import * as expenseType from "@/types/expenseType";

export default function ExpenseType() {
  const { isPending, error, data } = useQuery({
    queryKey: ["types"],
    queryFn: async (): Promise<expenseType.ExpenseType[]> => {
      return (await apiRequest("/cxf/type", "GET")).json();
    },
  });

  if (error) {
    showToast("An error has occurred", error.message);
    return null;
  }

  if (isPending) return <Skeleton />;

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
        />
      </header>
      <main
        className="flex min-h-[calc(100vh-4rem)] w-full justify-center py-4"
        role="main"
      >
        <DataTable columns={columns} data={data} />
      </main>
    </div>
  );
}
