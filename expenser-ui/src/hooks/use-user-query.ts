import { apiRequest } from "@/lib/apiRequest";
import { showToast } from "@/lib/showToast";
import { User } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetUserQuery = () => {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<User> => {
      const res = await apiRequest("/cxf/user", "GET");
      return res.json();
    },
  });

  return query;
};
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data: {
      name: string;
      username: string;
      password: string;
    }) => {
      const res = await apiRequest("/cxf/user", "POST", data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      showToast("User Created", "User created successfully.");
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["user"] }),
    onError: (error: Error) =>
      showToast("User Creation Failed", error.message, "destructive"),
  });
  return mutation;
};

export const useUpdateUserMutation = () => {
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
    onError: (error) =>
      showToast("Account Update Failed", error.message, "destructive"),
  });

  return mutation;
};
