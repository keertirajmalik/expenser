import { TypeFormSchema } from "@/app/create-dialog/type-form";
import { apiRequest } from "@/lib/apiRequest";
import { showToast } from "@/lib/showToast";
import { Type } from "@/types/expenseType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const useGetTypeQuery = () => {
  const query = useQuery({
    queryKey: ["types"],
    queryFn: async (): Promise<Type[]> => {
      const res = await apiRequest("/cxf/type", "GET");
      return res.json();
    },
  });
  return query;
};

export const useCreateTypeMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof TypeFormSchema>) => {
      const res = await apiRequest("/cxf/type", "POST", data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      showToast("Type Created", "Type created successfully.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["types"] }),
    onError: (error: Error) => showToast("Type Creation Failed", error.message),
  });

  return mutation;
};

export const useUpdateTypeMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: {
      type: z.infer<typeof TypeFormSchema>;
      id: string;
    }) => {
      const res = await apiRequest(`/cxf/type/${data.id}`, "PUT", data.type);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      showToast("Type Updated", "Type updated successfully.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["types"] }),
    onError: (error) => showToast("Type Update Failed", error.message),
  });
  return mutation;
};

export const useDeleteTypeMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest(`/cxf/type/${id}`, "DELETE");

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      showToast("Type Deleted", "Type deleted successfully.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["types"] }),
    onError: (error) => showToast("Type Deletion Failed", error.message),
  });
  return mutation;
};
