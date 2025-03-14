import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Expense } from "@/types/expense";
import { Income } from "@/types/income";
import { Investment } from "@/types/investment";
import { format, parse } from "date-fns";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

interface ChartData {
  month: string;
  expense: number;
  income: number;
  investment: number;
}

interface LineChartProps {
  expenseData: Expense[];
  incomeData: Income[];
  investmentData: Investment[];
}

const formatDate = (date: string) =>
  format(parse(date, "dd/MM/yyyy", new Date()), "MMM/yy");

const generateChartData = (
  expenses: Expense[],
  incomes: Income[],
  investments: Investment[],
): ChartData[] => {
  const dataMap: Record<string, ChartData> = {};

  for (const item of expenses) {
    const month = formatDate(item.date.toString());
    const amount = parseFloat(item.amount);

    if (!dataMap[month]) {
      dataMap[month] = { month, expense: 0, income: 0, investment: 0 };
    }
    dataMap[month].expense += amount;
  }

  for (const item of incomes) {
    const month = formatDate(item.date.toString());
    const amount = parseFloat(item.amount);

    if (!dataMap[month]) {
      dataMap[month] = { month, expense: 0, income: 0, investment: 0 };
    }
    dataMap[month].income += amount;
  }

  for (const item of investments) {
    const month = formatDate(item.date.toString());
    const amount = parseFloat(item.amount);

    if (!dataMap[month]) {
      dataMap[month] = { month, expense: 0, income: 0, investment: 0 };
    }
    dataMap[month].investment += amount;
  }

  return Object.values(dataMap);
};

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  expense: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
  investment: {
    label: "Investment",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function LineChartComponent({
  expenseData,
  incomeData,
  investmentData,
}: LineChartProps) {
  const chartData = generateChartData(expenseData, incomeData, investmentData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income, Expense & Investment</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0.5">
        <ChartContainer
          config={chartConfig}
          className="min-h-[180px] sm:min-h-[200px] w-full"
        >
          <LineChart accessibilityLayer data={chartData.reverse()}>
            <CartesianGrid vertical={false} horizontal={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tickFormatter={(value) => value}
              padding={{ left: 15, right: 15 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="expense"
              type="monotone"
              stroke="var(--color-expense)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="income"
              type="monotone"
              stroke="var(--color-income)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="investment"
              type="monotone"
              stroke="var(--color-investment)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
