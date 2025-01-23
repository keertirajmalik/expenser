import { ExpenseFormSchema } from "@/app/create-dialog/expense-form";
import { apiRequest } from "@/lib/apiRequest";
import { showToast } from "@/lib/showToast";
import { Expense } from "@/types/expense";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { z } from "zod";

export const useGetExpensesQuery = () => {
  const query = useQuery({
    queryKey: ["expenses"],
    queryFn: async (): Promise<Expense[]> => {
      const res = await apiRequest("/cxf/transaction", "GET");
      return res.json();
    },
  });
  return query;
};

export const useCreateExpenseMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof ExpenseFormSchema>) => {
      const expenseData = {
        ...data,
        amount: parseFloat(data.amount),
        date: format(data.date, "dd/MM/yyyy"),
      };

      const res = await apiRequest("/cxf/transaction", "POST", expenseData);
      if (!res.ok) {
        throw new Error(`Failed to save expense: ${res.statusText}`);
      }
    },
    onSuccess: () =>
      showToast("Expense Created", "Expense created successfully."),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
    onError: (error: Error) =>
      showToast("Expense Creation Failed", error.message, "destructive"),
  });

  return mutation;
};

export const useUpdateExpenseMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: {
      expense: z.infer<typeof ExpenseFormSchema>;
      id: string;
    }) => {
      const expenseData = {
        ...data.expense,
        amount: Number.isFinite(parseFloat(data.expense.amount))
          ? parseFloat(data.expense.amount)
          : (() => {
              throw new Error("Invalid amount format");
            })(),
        date: format(data.expense.date, "dd/MM/yyyy"),
      };
      const res = await apiRequest(
        `/cxf/transaction/${data.id}`,
        "PUT",
        expenseData,
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      showToast("Expense Updated", "Expense updated successfully.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
    onError: (error) =>
      showToast("Expense Update Failed", error.message, "destructive"),
  });
  return mutation;
};

export const useDeleteExpenseQuery = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest(`/cxf/transaction/${id}`, "DELETE");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      showToast("Expense Deleted", "Expense deleted successfully.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["expenses"] }),
    onError: (error) =>
      showToast("Expense Deletion Failed", error.message, "destructive"),
  });

  return mutation;
};
