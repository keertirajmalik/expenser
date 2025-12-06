import { apiRequest } from "@/lib/apiRequest";
import { showToast } from "@/lib/showToast";
import { Investment } from "@/types/investment";
import { TransactionFormSchema } from "@/types/form-schema/transaction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { z } from "zod";

export const useGetInvestmentQuery = () => {
  const query = useQuery({
    queryKey: ["investments"],
    queryFn: async (): Promise<Investment[]> => {
      const res = await apiRequest("/cxf/investment", "GET");
      return res.json();
    },
  });
  return query;
};

export const useCreateInvestmentMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof TransactionFormSchema>) => {
      const investmentData = {
        ...data,
        amount: parseFloat(data.amount),
        date: format(data.date, "dd/MM/yyyy"),
      };

      const res = await apiRequest("/cxf/investment", "POST", investmentData);
      if (!res.ok) {
        throw new Error(`Failed to save investment: ${res.statusText}`);
      }
    },
    onSuccess: () =>
      showToast("Investment Created", "Investment created successfully."),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["investments"] }),
    onError: (error: Error) =>
      showToast("Investment Creation Failed", error.message, "destructive"),
  });

  return mutation;
};

export const useUpdateInvestmentMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: {
      investment: z.infer<typeof TransactionFormSchema>;
      id: string;
    }) => {
      const investmentData = {
        ...data.investment,
        amount: Number.isFinite(parseFloat(data.investment.amount))
          ? parseFloat(data.investment.amount)
          : (() => {
              throw new Error("Invalid amount format");
            })(),
        date: format(data.investment.date, "dd/MM/yyyy"),
      };
      const res = await apiRequest(
        `/cxf/investment/${data.id}`,
        "PUT",
        investmentData,
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      showToast("Investment Updated", "Investment updated successfully.");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["investments"] }),
    onError: (error) =>
      showToast("Investment Update Failed", error.message, "destructive"),
  });
  return mutation;
};

export const useDeleteInvestmentMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest(`/cxf/investment/${id}`, "DELETE");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      showToast("Investment Deleted", "Investment deleted successfully.");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["investments"] }),
    onError: (error) =>
      showToast("Investment Deletion Failed", error.message, "destructive"),
  });

  return mutation;
};
