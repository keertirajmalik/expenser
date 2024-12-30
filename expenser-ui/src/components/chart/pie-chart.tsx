import { Label, Pie, PieChart } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Expense } from "@/types/expense";

interface ChartData {
  type: string;
  amount: number;
  fill: string;
}

interface PieChartProps {
  data: Expense[];
}

const generateColors = (count: number): string[] => {
  const baseHue = 210;
  const saturation = 70;
  const lightness = 50;
  return Array.from({ length: count }, (_, i) => {
    const hue = (baseHue + (i * 360) / count) % 360;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });
};

const getUniqueTypes = (expenses: Expense[]): string[] => {
  return Array.from(new Set(expenses.map((item: Expense) => item.type)));
};

const createChartConfig = (data: Expense[]): ChartConfig => {
  const uniqueTypes = getUniqueTypes(data);
  const colors = generateColors(uniqueTypes.length);
  return uniqueTypes.reduce<ChartConfig>((acc, type, index) => {
    acc[type] = { label: type, color: colors[index] };
    return acc;
  }, {});
};

const generateChartData = (expenses: Expense[]): ChartData[] => {
  const typeMap = expenses.reduce((acc: Record<string, number>, item) => {
    const amount = parseFloat(item.amount);
    acc[item.type] = (acc[item.type] || 0) + amount;
    return acc;
  }, {});
  const uniqueTypes = Object.keys(typeMap);
  const colors = generateColors(uniqueTypes.length);
  return uniqueTypes.map((type, index) => ({
    type,
    amount: typeMap[type],
    fill: colors[index],
  }));
};

export function PieChartComponent({ data }: PieChartProps) {
  const chartConfig = createChartConfig(data);
  const chartData = generateChartData(data);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0 ">
        <CardTitle>Expense By Type Chart</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0 ">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square min-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-xl font-bold"
                        >
                          {chartData
                            .reduce((acc, curr) => acc + curr.amount, 0)
                            .toFixed(2)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Expenses
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="type" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
