import { apiRequest } from "@/lib/apiRequest";
import { showToast } from "@/lib/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUserQuery = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { name: string; image: string }) => {
      const res = await apiRequest("/cxf/user", "PUT", {
        name: data.name,
        image: data.image,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      showToast("Account Updated", "Account updated successfully.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
    onError: (error) => showToast("Account Update Failed", error.message),
  });

  return mutation;
};
