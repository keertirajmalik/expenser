export enum CategoryType {
  Investment = "Investment",
  Expense = "Expense",
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  description: string;
}
