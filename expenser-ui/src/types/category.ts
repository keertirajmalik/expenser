export enum CategoryType {
  Investment = "Investment",
  Expense = "Expense",
  Income = "Income",
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  description: string;
}
