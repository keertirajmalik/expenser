import { parse } from "date-fns";

export const parseDate = (dateStr: string): Date => {
  try {
    return parse(dateStr, "dd/MM/yyyy", new Date());
  } catch (error) {
    console.error("Failed to parse date:", error);
    return new Date();
  }
};
