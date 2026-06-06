import { useUserQuery } from "../features/auth/hooks/use-auth";

export const useAuth = () => {
  const { data, isPending, isError, error } = useUserQuery();

  return {
    userData: data ?? null,
    loading: isPending,
    error: isError ? error : null,
  };
};
