import { CreateDialog } from "@/app/create-dialog/create-dialog";
import { columns } from "@/app/investment/column";
import { DataTable } from "@/components/data-table/data-table";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetInvestmentQuery } from "@/hooks/use-investment-query";
import { Separator } from "@radix-ui/react-separator";

export default function Expense() {
  const { data } = useGetInvestmentQuery();

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
            <h1 className="text-lg font-semibold">Investments</h1>
            <p className="text-sm text-gray-500">List of Your Investments</p>
          </div>
        </div>
        <CreateDialog
          creation="Investment"
          title="Create Investment"
          description=" Provide information regarding expense."
        />
      </header>
      <main
        className="flex min-h-[calc(100vh-4rem)] w-full justify-center py-4"
        role="main"
      >
        <DataTable columns={columns} data={data ?? []} />
      </main>
    </div>
  );
}
