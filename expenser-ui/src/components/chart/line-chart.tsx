import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { apiRequest } from "@/lib/apiRequest";
import { Expense } from "@/types/expense";
import { compareAsc, format, parse } from "date-fns";
import { useEffect, useState } from "react";

interface ChartData {
  month: string;
  amount: number;
}

const fetchExpenses = (
  setChartData: React.Dispatch<React.SetStateAction<ChartData[]>>,
) => {
  apiRequest("/cxf/transaction", "GET").then((response) => {
    response.json().then((data) => {
      if (Array.isArray(data.transactions)) {
        const chartData = generateChartData(data.transactions);
        console.log(chartData);
        setChartData(chartData);
      }
    });
  });
};

const formatDate = (date: string) =>
  format(parse(date, "dd/MM/yyyy", new Date()), "MMM/yy");

const generateChartData = (expenses: Expense[]): ChartData[] => {
  return expenses
    .reduce((acc: ChartData[], item) => {
      const formattedDate = formatDate(item.date.toString());
      const existingItem = acc.find(
        (accItem) => accItem.month === formattedDate,
      );
      const amount = parseFloat(item.amount);
      if (existingItem) {
        existingItem.amount += amount;
      } else {
        acc.push({ month: formattedDate, amount });
      }
      return acc;
    }, [])
    .sort((a, b) =>
      compareAsc(
        parse(a.month, "MMM/yyyy", new Date()),
        parse(b.month, "MMM/yyyy", new Date()),
      ),
    )
    .map((item) => ({
      ...item,
      amount: parseFloat(item.amount.toFixed(2)),
    }));
};

const chartConfig = {
  desktop: {
    label: "Expenses",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function LineChartComponent() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  useEffect(() => {
    fetchExpenses(setChartData);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expense Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
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
              dataKey="amount"
              type="monotone"
              stroke="var(--color-desktop)"
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
