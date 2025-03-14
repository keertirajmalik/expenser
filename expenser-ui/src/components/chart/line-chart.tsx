import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

export interface LineChartData {
  month: string;
  expense: number;
  income: number;
  investment: number;
}

interface LineChartProps {
  data: LineChartData[];
}

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

export function LineChartComponent({ data }: LineChartProps) {
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
          <LineChart accessibilityLayer data={data.reverse()}>
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
