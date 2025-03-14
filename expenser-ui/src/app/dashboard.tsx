import { BarChartComponent } from "@/components/chart/bar-chart";
import { CardComponent } from "@/components/chart/card-component";
import { LineChartComponent } from "@/components/chart/line-chart";
import { PieChartComponent } from "@/components/chart/pie-chart";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetExpensesQuery } from "@/hooks/use-expense-query";
import { useGetIncomeQuery } from "@/hooks/use-income-query";
import { useGetInvestmentQuery } from "@/hooks/use-investment-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const isMobile = useIsMobile();
  const { data: expenseData = [] } = useGetExpensesQuery();
  const { data: investmentData = [] } = useGetInvestmentQuery();
  const { data: incomeData = [] } = useGetIncomeQuery();

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
          className={`grid gap-2 ${isMobile ? "grid-cols-1" : "grid-cols-3"}`}
        >
          <CardComponent
            data={incomeData}
            title="Total Incomes"
            icon=<DollarSign />
          />
          <CardComponent
            data={investmentData}
            title="Total Investments"
            icon=<TrendingUp />
          />
          <CardComponent
            data={expenseData}
            title="Total Expenses"
            icon=<TrendingDown />
          />
          <PieChartComponent data={incomeData} title="Income" />
          <PieChartComponent data={investmentData} title="Investment" />
          <PieChartComponent data={expenseData} title="Expense" />
          <LineChartComponent
            expenseData={expenseData}
            incomeData={incomeData}
            investmentData={investmentData}
          />
          <BarChartComponent data={expenseData} />
        </div>
      </main>
    </div>
  );
}
