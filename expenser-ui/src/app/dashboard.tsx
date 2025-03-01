import { BarChartComponent } from "@/components/chart/bar-chart";
import { LineChartComponent } from "@/components/chart/line-chart";
import { PieChartComponent } from "@/components/chart/pie-chart";
import { RecentExpenses } from "@/components/chart/recent-expense";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetExpensesQuery } from "@/hooks/use-expense-query";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const isMobile = useIsMobile();
  const { data = [] } = useGetExpensesQuery();

  return (
    <div className="flex min-h-screen w-full flex-col gap-2">
      <header
        className="flex h-16 shrink-0 items-center gap-2 border-b px-4"
        role="banner"
      >
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className={`text-sm text-gray-500 ${isMobile ? "sr-only" : ""}`}>
            Keep Track, Assess, and Enhance Your Financial Performance
          </p>
        </div>
      </header>
      <main
        className="grid place-items-center gap-2 container mx-auto px-4"
        role="main"
      >
        <div
          className={`grid gap-2 ${isMobile ? "grid-cols-1" : "grid-cols-2"}`}
        >
          <PieChartComponent data={data} />
          <LineChartComponent data={data} />
          <BarChartComponent data={data} />
          <RecentExpenses data={data} />
        </div>
      </main>
    </div>
  );
}
