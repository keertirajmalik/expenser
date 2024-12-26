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
import { apiRequest } from "@/lib/apiRequest";
import { useEffect, useState } from "react";

interface ChartData {
  type: string;
  amount: number;
  fill: string;
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

const createChartConfig = (types: string[], colors: string[]): ChartConfig => {
  return types.reduce<ChartConfig>((acc, type, index) => {
    acc[type] = { label: type, color: colors[index] };
    return acc;
  }, {});
};

const generateChartData = (expenses: Expense[]): ChartData[] => {
  const colors = generateColors(expenses.length);
  return expenses.reduce((acc: ChartData[], item, index) => {
    const amount = parseFloat(item.amount);
    const existingItem = acc.find((accItem) => accItem.type === item.type);
    if (existingItem) {
      existingItem.amount += amount;
    } else {
      acc.push({ type: item.type, amount, fill: colors[index] });
    }
    return acc;
  }, []);
};

const fetchExpenses = (
  setChartConfig: React.Dispatch<React.SetStateAction<ChartConfig>>,
  setChartData: React.Dispatch<React.SetStateAction<ChartData[]>>,
) => {
  apiRequest("/cxf/transaction", "GET")
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data.transactions)) {
        const uniqueTypes = getUniqueTypes(data.transactions);
        const colors = generateColors(uniqueTypes.length);
        const newChartConfig = createChartConfig(uniqueTypes, colors);
        setChartConfig(newChartConfig);
        const chartData = generateChartData(data.transactions);
        setChartData(chartData);
      }
    });
};

export function PieChartComponent() {
  const [chartConfig, setChartConfig] = useState<ChartConfig>({});
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetchExpenses(setChartConfig, setChartData);
  }, []);

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
