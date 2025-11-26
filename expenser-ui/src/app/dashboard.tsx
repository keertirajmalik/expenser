import { BarChartComponent } from "@/components/chart/bar-chart";
import { CardComponent } from "@/components/chart/card-component";
import {
  LineChartComponent,
  LineChartData,
} from "@/components/chart/line-chart";
import { PieChartComponent, PieChartData } from "@/components/chart/pie-chart";
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
import { format, parse } from "date-fns";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { useMemo } from "react";

export default function Dashboard() {
  const isMobile = useIsMobile();
  const { data: expenseData = [] } = useGetExpensesQuery();
  const { data: investmentData = [] } = useGetInvestmentQuery();
  const { data: incomeData = [] } = useGetIncomeQuery();
  const { theme } = useTheme();

  const incomeChartData = useMemo(
    () => generatepieChartData(incomeData),
    [incomeData],
  );
  const investmentChartData = useMemo(
    () => generatepieChartData(investmentData),
    [investmentData],
  );
  const expenseChartData = useMemo(
    () => generatepieChartData(expenseData),
    [expenseData],
  );

  const dollarSignColor = theme === "dark" ? "#0000ff" : "#3b50ba";
  const trendingUpColor = theme === "dark" ? "#00ff00" : "#226f06";
  const trendingDownColor = theme === "dark" ? "#ff0000" : "#d31212";

  return (
    <div className="flex h-96 w-full flex-col gap-2">
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
            <h1 className="text-lg font-semibold">Dashboard</h1>
            <p
              className={`text-sm text-muted-foreground ${isMobile ? "sr-only" : ""}`}
            >
              Keep Track, Assess, and Enhance Your Financial Performance
            </p>
          </section>
        </div>
      </header>
      <main
        className="grid place-items-center gap-2 container mx-auto px-4"
        role="main"
      >
        <div className="grid gap-2 grid-cols-1 md:grid-cols-3">
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
            data={incomeChartData}
            title="Income"
          />
          <PieChartComponent
            config={createChartConfig(investmentData)}
            data={investmentChartData}
            title="Investment"
          />
          <PieChartComponent
            config={createChartConfig(expenseData)}
            data={expenseChartData}
            title="Expense"
          />
          <LineChartComponent
            data={generateLineChartData(
              expenseData,
              incomeData,
              investmentData,
            )}
          />
          <BarChartComponent data={expenseData} />
        </div>
      </main>
    </div>
  );
}

const generatepieChartData = (
  data: Expense[] | Investment[] | Income[],
): PieChartData[] => {
  if (!data || data.length === 0) return [];

  const typeMap = data.reduce((acc: Record<string, number>, item) => {
    const amount = parseFloat(item.amount);
    acc[item.category] =
      (acc[item.category] || 0) + (isNaN(amount) ? 0 : amount);
    return acc;
  }, {});
  const uniqueCategories = Object.keys(typeMap);
  const colors = generateColors(uniqueCategories.length);

  return uniqueCategories.map((category, index) => ({
    category,
    amount: typeMap[category],
    fill: colors[index],
  }));
};

const formatDate = (date: string) =>
  format(parse(date, "dd/MM/yyyy", new Date()), "MMM/yy");

const generateLineChartData = (
  expenses: Expense[],
  incomes: Income[],
  investments: Investment[],
): LineChartData[] => {
  const dataMap: Record<string, LineChartData> = {};
  // Helper function to process each data array
  const processData = (
    items: Array<{ date: string | Date; amount: string }>,
    field: "expense" | "income" | "investment",
  ) => {
    for (const item of items) {
      const month = formatDate(item.date.toString());
      const amount = parseFloat(item.amount);

      if (!dataMap[month]) {
        dataMap[month] = { month, expense: 0, income: 0, investment: 0 };
      }
      dataMap[month][field] += amount;
    }
  };

  processData(expenses, "expense");
  processData(incomes, "income");
  processData(investments, "investment");

  return Object.values(dataMap);
};
