import { z } from "zod";

export const CategoryFormSchema = z.object({
  name: z.string().nonempty({
    message: "Expense category name is required.",
  }),
  type: z
    .string({
      error: "Please select a category type",
    })
    .refine((val) => ["Expense", "Investment", "Income"].includes(val), {
      message: "Type must be either 'Expense' or 'Investment' or 'Income'",
    }),
  description: z.string(),
});

export type CategoryFormValues = z.infer<typeof CategoryFormSchema>;
