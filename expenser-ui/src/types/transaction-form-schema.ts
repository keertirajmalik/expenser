import z from "zod";

export const TransactionFormSchema = z.object({
  name: z.string().nonempty({
    message: "Name is required.",
  }),
  category: z.string().nonempty({
    message: "Category is required.",
  }),
  amount: z
    .string()
    .nonempty({ message: "Amount is required." })
    .transform((val) => val.replace(/[^0-9.]/g, "")) // Remove currency formatting
    .refine((val) => /^(?:\d{1,15}|\d{1,15}\.\d{1,4})$/.test(val), {
      message:
        "Amount must be a positive number with up to 4 decimal places (max 15 digits).",
    })
    .refine((val) => parseFloat(val) > 0, {
      message: "Amount must be greater than 0.",
    }),
  date: z.date({
    error: "Date is required.",
  }),
  note: z.string(),
});