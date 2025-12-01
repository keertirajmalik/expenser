import { CreateDialog } from "@/app/create-dialog/create-dialog";
import { columns } from "@/app/expense/column";
import { DataTable } from "@/components/data-table/data-table";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetExpensesQuery } from "@/hooks/use-expense-query";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Expense() {
  const { data } = useGetExpensesQuery();
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
            <h1 className="text-lg font-semibold">Expense</h1>
            <p
              className={`text-sm text-muted-foreground ${isMobile ? "sr-only" : ""}`}
            >
              List of Your Expenses
            </p>
          </section>
        </div>
        <div className="sticky top-0 right-2">
          <CreateDialog
            creation="Expense"
          />
        </div>
      </header>
      <main
        className="flex min-h-[calc(100vh-4rem)] w-full justify-center py-4 relative"
        role="main"
      >
        {!data && <Skeleton className="absolute inset-0 bg-background/50" />}
        <DataTable columns={columns} data={data ?? []} />
      </main>
    </div>
  );
}
