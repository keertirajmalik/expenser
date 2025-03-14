import { ChartConfig } from "@/components/ui/chart";
import { Expense } from "@/types/expense";
import { Income } from "@/types/income";
import { Investment } from "@/types/investment";

const getUniqueCategories = (
  data: Expense[] | Investment[] | Income[],
): string[] => {
  return Array.from(
    new Set(data.map((item: Expense | Investment | Income) => item.category)),
  );
};

export const generateColors = (count: number): string[] => {
  const baseHue = 210;
  const saturation = 70;
  const lightness = 50;
  return Array.from({ length: count }, (_, i) => {
    const hue = (baseHue + (i * 360) / count) % 360;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });
};

export const createChartConfig = (
  data: Expense[] | Investment[] | Income[],
): ChartConfig => {
  const uniqueCategories = getUniqueCategories(data);
  const colors = generateColors(uniqueCategories.length);
  return uniqueCategories.reduce<ChartConfig>((acc, category, index) => {
    acc[category] = { label: category, color: colors[index] };
    return acc;
  }, {});
};
