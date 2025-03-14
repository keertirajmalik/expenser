import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Expense } from "@/types/expense";
import { Income } from "@/types/income";
import { format, parse } from "date-fns";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

interface ChartData {
  month: string;
  expense: number;
  income: number;
}

interface LineChartProps {
  expenseData: Expense[];
  incomeData: Income[];
}

const formatDate = (date: string) =>
  format(parse(date, "dd/MM/yyyy", new Date()), "MMM/yy");

const generateChartData = (
  expenses: Expense[],
  incomes: Income[],
): ChartData[] => {
  const dataMap: Record<string, ChartData> = {};

  for (const item of expenses) {
    const month = formatDate(item.date.toString());
    const amount = parseFloat(item.amount);

    if (!dataMap[month]) {
      dataMap[month] = { month, expense: 0, income: 0 };
    }
    dataMap[month].expense += amount;
  }

  for (const item of incomes) {
    const month = formatDate(item.date.toString());
    const amount = parseFloat(item.amount);

    if (!dataMap[month]) {
      dataMap[month] = { month, expense: 0, income: 0 };
    }
    dataMap[month].income += amount;
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
} satisfies ChartConfig;

export function LineChartComponent({
  expenseData,
  incomeData,
}: LineChartProps) {
  const chartData = generateChartData(expenseData, incomeData);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income & Expense</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0.5">
        <ChartContainer
          config={chartConfig}
          className="min-h-[180px] sm:min-h-[200px] w-full"
        >
          <LineChart accessibilityLayer data={chartData}>
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
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

//TODO: Add a line for each type to display monthly expenses
