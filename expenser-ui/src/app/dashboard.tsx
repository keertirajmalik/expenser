import { BarChartComponent } from "@/components/chart/bar-chart";
import { CardComponent } from "@/components/chart/card-component";
import { LineChartComponent } from "@/components/chart/line-chart";
import { ChartData, PieChartComponent } from "@/components/chart/pie-chart";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useGetExpensesQuery } from "@/hooks/use-expense-query";
import { useGetIncomeQuery } from "@/hooks/use-income-query";
import { useGetInvestmentQuery } from "@/hooks/use-investment-query";
import { useIsMobile } from "@/hooks/use-mobile";
import { createChartConfig, generateColors } from "@/lib/chart-util";
import { useTheme } from "@/providers/theme-provider";
import { Expense } from "@/types/expense";
import { Income } from "@/types/income";
import { Investment } from "@/types/investment";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const isMobile = useIsMobile();
  const { data: expenseData = [] } = useGetExpensesQuery();
  const { data: investmentData = [] } = useGetInvestmentQuery();
  const { data: incomeData = [] } = useGetIncomeQuery();
  const { theme } = useTheme();

  const dollarSignColor = theme === "dark" ? "#0000ff" : "#3b50ba";
  const trendingUpColor = theme === "dark" ? "#00ff00" : "#226f06";
  const trendingDownColor = theme === "dark" ? "#ff0000" : "#d31212";

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
            title="Total Income"
            icon={<DollarSign color={dollarSignColor} />}
          />
          <CardComponent
            data={investmentData}
            title="Total Investment"
            icon={<TrendingUp color={trendingUpColor} />}
          />
          <CardComponent
            data={expenseData}
            title="Total Expense"
            icon={<TrendingDown color={trendingDownColor} />}
          />
          <PieChartComponent
            config={createChartConfig(incomeData)}
            data={generateChartData(incomeData)}
            title="Income"
          />
          <PieChartComponent
            config={createChartConfig(investmentData)}
            data={generateChartData(investmentData)}
            title="Investment"
          />
          <PieChartComponent
            config={createChartConfig(expenseData)}
            data={generateChartData(expenseData)}
            title="Expense"
          />
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

const generateChartData = (
  data: Expense[] | Investment[] | Income[],
): ChartData[] => {
  const typeMap = data.reduce((acc: Record<string, number>, item) => {
    const amount = parseFloat(item.amount);
    acc[item.category] = (acc[item.category] || 0) + amount;
    return acc;
  }, {});
  const uniqueCategorys = Object.keys(typeMap);
  const colors = generateColors(uniqueCategorys.length);

  return uniqueCategorys.map((category, index) => ({
    category,
    amount: typeMap[category],
    fill: colors[index],
  }));
};
