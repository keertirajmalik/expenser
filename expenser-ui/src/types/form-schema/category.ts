import { z } from "zod";
import { CategoryType } from "@/types/category";

export const CategoryFormSchema = z.object({
  name: z.string().nonempty({
    message: "Category name is required.",
  }),
  type: z
    .string({
      error: "Please select a category type",
    })
    .refine(
      (val) => Object.values(CategoryType).includes(val as CategoryType),
      {
        message: `Type must be one of: ${Object.values(CategoryType).join(", ")}`,
      },
    ),
  description: z.string(),
});

export type CategoryFormValues = z.infer<typeof CategoryFormSchema>;
