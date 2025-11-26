import { CreateDialog } from "@/app/create-dialog/create-dialog";
import { columns } from "@/app/investment/column";
import { DataTable } from "@/components/data-table/data-table";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetInvestmentQuery } from "@/hooks/use-investment-query";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Investment() {
  const { data } = useGetInvestmentQuery();
  const isMobile = useIsMobile();

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
          <section className="flex flex-col">
            <h1 className="text-lg font-semibold">Investments</h1>
            <p
              className={`text-sm text-muted-foreground ${isMobile ? "sr-only" : ""}`}
            >
              List of Your Investments
            </p>
          </section>
        </div>
        <div className="sticky top-0 right-2">
          <CreateDialog
            creation="Investment"
            title="Create Investment"
            description="Provide information regarding your investment."
          />
        </div>
      </header>
      <main className="flex flex-1 w-full justify-center py-4" role="main">
        <DataTable columns={columns} data={data ?? []} />
      </main>
    </div>
  );
}
