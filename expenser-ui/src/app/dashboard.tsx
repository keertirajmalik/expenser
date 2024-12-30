import { BarChartComponent } from "@/components/chart/bar-chart";
import { LineChartComponent } from "@/components/chart/line-chart";
import { PieChartComponent } from "@/components/chart/pie-chart";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Dashboard() {
  return (
    <div className="flex h-96 w-full flex-col">
      <header
        className="flex h-16 shrink-0 items-center gap-2 border-b px-4"
        role="banner"
      >
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500">
            Keep Track, Assess, and Enhance Your Financial Performance
          </p>
        </div>
      </header>
      <main
        className="flex min-h-[calc(100vh-4rem)] w-full items-center justify-center px-4 gap-2"
        role="main"
      >
        <BarChartComponent />
        <PieChartComponent />
        <LineChartComponent />
      </main>
    </div>
  );
}
