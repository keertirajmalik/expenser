import { apiRequest } from "@/lib/apiRequest";
import { showToast } from "@/lib/showToast";
import { Category } from "@/types/category";
import { CategoryFormSchema } from "@/types/form-schema/category";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

export const useGetCategoryQuery = () => {
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<Category[]> => {
      const res = await apiRequest("/cxf/category", "GET");
      return res.json();
    },
  });
  return query;
};

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof CategoryFormSchema>) => {
      const res = await apiRequest("/cxf/category", "POST", data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      showToast("Category Created", "Category created successfully.");
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
    onError: (error: Error) =>
      showToast("Category Creation Failed", error.message, "destructive"),
  });

  return mutation;
};

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: {
      category: z.infer<typeof CategoryFormSchema>;
      id: string;
    }) => {
      const res = await apiRequest(
        `/cxf/category/${data.id}`,
        "PUT",
        data.category,
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      showToast("Category Updated", "Category updated successfully.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (error) =>
      showToast("Category Update Failed", error.message, "destructive"),
  });
  return mutation;
};

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest(`/cxf/category/${id}`, "DELETE");

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      showToast("Category Deleted", "Category deleted successfully.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
    },
    onError: (error) =>
      showToast("Category Deletion Failed", error.message, "destructive"),
  });
  return mutation;
};
