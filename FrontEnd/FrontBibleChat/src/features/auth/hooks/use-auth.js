import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authServices } from "../api/auth-api";

export function useUserQuery() {
  return useQuery({
    queryKey: ["auth-user"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) return null;

      return authServices.getUser();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useLoginMutation() {
  const queryClient = useQueryClient();
  const { data, isPending, isError, error, mutate } = useMutation({
    mutationFn: ({ email, password }) => authServices.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-user"] });
    },
  });

  return { data, isPending, isError, error, mutate };
}

export function useRegisterMutation() {
  const { data, isPending, isError, error, mutate } = useMutation({
    mutationFn: ({ email, username, password }) =>
      authServices.register(email, username, password),
    onSuccess: (data) => console.log(data),
  });

  return { data, isPending, isError, error, mutate };
}

export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const { data, isPending, isError, error, mutate } = useMutation({
    mutationFn: () => authServices.logout(),
    onSuccess: () => {
      queryClient.setQueryData(["auth-user"], null);
      queryClient.removeQueries({ queryKey: ["auth-user"] });
    },
  });

  return { data, isPending, isError, error, mutate };
}
