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

export interface PieChartData {
  category: string;
  amount: number;
  fill: string;
}

interface PieChartProps {
  config: ChartConfig;
  data: PieChartData[];
  title: string;
  currency?: string;
  locale?: string;
}

export function PieChartComponent({
  config,
  data,
  title,
  currency = "INR",
  locale = "en-IN",
}: PieChartProps) {
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  });
  const total = formatter.format(
    data.reduce((acc, curr) => acc + curr.amount, 0),
  );

  return (
    <Card>
      <CardHeader className="pb-0 ">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0.5">
        <ChartContainer
          config={config}
          className="mx-auto aspect-square min-h-[180px] sm:min-h-[200px] md:min-h-[250px] w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              innerRadius={
                config.responsive ? Math.min(60, window.innerWidth / 10) : 80
              }
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
                          className="fill-foreground text-lg font-bold"
                        >
                          {total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total {title}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
