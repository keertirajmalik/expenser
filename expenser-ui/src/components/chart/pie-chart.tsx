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
import { Income } from "@/types/income";
import { Investment } from "@/types/investment";

interface ChartData {
  category: string;
  amount: number;
  fill: string;
}

interface PieChartProps {
  data: Expense[] | Investment[] | Income[];
  title: string;
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

const getUniqueCategories = (
  data: Expense[] | Investment[] | Income[],
): string[] => {
  return Array.from(
    new Set(data.map((item: Expense | Investment | Income) => item.category)),
  );
};

const createChartConfig = (
  data: Expense[] | Investment[] | Income[],
): ChartConfig => {
  const uniqueCategories = getUniqueCategories(data);
  const colors = generateColors(uniqueCategories.length);
  return uniqueCategories.reduce<ChartConfig>((acc, category, index) => {
    acc[category] = { label: category, color: colors[index] };
    return acc;
  }, {});
};

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

export function PieChartComponent({ data, title }: PieChartProps) {
  const chartConfig = createChartConfig(data);
  const chartData = generateChartData(data);

  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  });
  const total = formatter.format(
    chartData.reduce((acc, curr) => acc + curr.amount, 0),
  );

  return (
    <Card>
      <CardHeader className="pb-0 ">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0.5">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square min-h-[180px] sm:min-h-[200px] md:min-h-[250px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="category"
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
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total {title}s
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
