import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { apiRequest } from "@/lib/apiRequest";
import { Expense } from "@/types/expense";
import { useEffect, useState } from "react";
import { parse, compareAsc, format } from "date-fns";

const fetchExpenses = (
  setChartData: React.Dispatch<React.SetStateAction<ChartData[]>>,
) => {
  apiRequest("/cxf/transaction", "GET").then((response) => {
    response.json().then((data) => {
      if (Array.isArray(data.transactions)) {
        const chartData = generateChartData(data.transactions);
        setChartData(chartData);
      }
    });
  });
};

const generateChartData = (expenses: Expense[]): ChartData[] => {
  return expenses
    .reduce((acc: ChartData[], item) => {
      const existingItem = acc.find((accItem) => accItem.date === item.date);
      const amount = parseFloat(item.amount);
      if (existingItem) {
        existingItem.amount += amount;
      } else {
        acc.push({ date: item.date, amount });
      }
      return acc;
    }, [])
    .sort((a, b) => compareAsc(parseDate(a.date), parseDate(b.date)))
    .map((item) => ({
      ...item,
      amount: parseFloat(item.amount.toFixed(2)),
    }));
};

const chartConfig = {
  expense: {
    label: "Expenses",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface ChartData {
  date: Date;
  amount: number;
}

const parseDate = (dateStr: Date) =>
  parse(dateStr.toString(), "dd/MM/yyyy", new Date());

export function BarChartComponent() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  useEffect(() => {
    fetchExpenses(setChartData);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Expense Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(date) => format(parseDate(date), "d/MMM")}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="amount" fill="var(--color-expense)" radius={8}>
              <LabelList
                position="center"
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
