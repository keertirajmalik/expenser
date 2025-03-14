import { ChartConfig } from "@/components/ui/chart";
import { Expense } from "@/types/expense";
import { Income } from "@/types/income";
import { Investment } from "@/types/investment";

/**
 * Extracts unique categories from an array of financial data items
 * @param data Array of Expense, Investment, or Income objects
 * @returns Array of unique category strings
 */
const getUniqueCategories = (
  data: Expense[] | Investment[] | Income[],
): string[] => {
  return Array.from(
    new Set(data.map((item: Expense | Investment | Income) => item.category)),
  );
};

/**
 * Generates an array of HSL color strings with evenly distributed hues
 * @param count Number of colors to generate
 * @param seed Starting hue value (default: 210)
 * @param saturation Color saturation percentage (default: 70)
 * @param lightness Color lightness percentage (default: 50)
 * @returns Array of HSL color strings
 */
export const generateColors = (
  count: number,
  baseHue: number = 210,
  saturation: number = 70,
  lightness: number = 50,
): string[] => {
  return Array.from({ length: count }, (_, i) => {
    const hue = (baseHue + (i * 360) / count) % 360;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  });
};

export const createChartConfig = (
  data: Expense[] | Investment[] | Income[],
): ChartConfig => {
  if (!data.length) {
    return {};
  }
  const uniqueCategories = getUniqueCategories(data);
  const colors = generateColors(uniqueCategories.length);
  return uniqueCategories.reduce<ChartConfig>((acc, category, index) => {
    acc[category] = { label: category, color: colors[index] };
    return acc;
  }, {});
};
