import { apiRequest } from "@/lib/apiRequest";
import { showToast } from "@/lib/showToast";
import { Income } from "@/types/income";
import { TransactionFormSchema } from "@/types/transaction-form-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { z } from "zod";

export const useGetIncomeQuery = () => {
  const query = useQuery({
    queryKey: ["incomes"],
    queryFn: async (): Promise<Income[]> => {
      const res = await apiRequest("/cxf/income", "GET");
      return res.json();
    },
  });
  return query;
};

export const useCreateIncomeMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof TransactionFormSchema>) => {
      const incomeData = {
        ...data,
        amount: parseFloat(data.amount),
        date: format(data.date, "dd/MM/yyyy"),
      };

      const res = await apiRequest("/cxf/income", "POST", incomeData);
      if (!res.ok) {
        throw new Error(`Failed to save income: ${res.statusText}`);
      }
    },
    onSuccess: () =>
      showToast("Income Created", "Income created successfully."),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["incomes"] }),
    onError: (error: Error) =>
      showToast("Income Creation Failed", error.message, "destructive"),
  });

  return mutation;
};

export const useUpdateIncomeMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: {
      income: z.infer<typeof TransactionFormSchema>;
      id: string;
    }) => {
      const incomeData = {
        ...data.income,
        amount: Number.isFinite(parseFloat(data.income.amount))
          ? parseFloat(data.income.amount)
          : (() => {
              throw new Error("Invalid amount format");
            })(),
        date: format(data.income.date, "dd/MM/yyyy"),
      };
      const res = await apiRequest(`/cxf/income/${data.id}`, "PUT", incomeData);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      showToast("Income Updated", "Income updated successfully.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["incomes"] }),
    onError: (error) =>
      showToast("Income Update Failed", error.message, "destructive"),
  });
  return mutation;
};

export const useDeleteIncomeMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest(`/cxf/income/${id}`, "DELETE");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      showToast("Income Deleted", "Income deleted successfully.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["incomes"] }),
    onError: (error) =>
      showToast("Income Deletion Failed", error.message, "destructive"),
  });

  return mutation;
};
