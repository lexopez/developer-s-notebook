import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  login as loginApi,
  signup as signupApi,
  logout as logoutApi,
} from "@/service/apiAuth";
import toast from "react-hot-toast";
import { getCurrentUser } from "@/service/apiAuth";
import { useNavigate } from "react-router-dom";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    mutate: login,
    error,
    isPending,
  } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user.user);
      toast.success("Welcome back!");
      navigate("/");
    },
    onError: (err) => toast.error(err.message),
  });

  return { login, error, isPending };
}

export function useSignup() {
  const navigate = useNavigate();
  const {
    mutate: signup,
    error,
    isPending,
  } = useMutation({
    mutationFn: signupApi,
    onSuccess: () => {
      toast.success("Account created! Please verify your email.");
      navigate("/");
    },
    onError: (err) => toast.error(err.message),
  });

  return { signup, error, isPending };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: logout, isPending } = useMutation({
    mutationFn: logoutApi,
    onSuccess: () => {
      // 1. Remove all user data from the cache
      queryClient.removeQueries();
      // 2. Redirect to auth page
      navigate("/AuthPage", { replace: true });
      toast.success("Logged out successfully");
    },
  });

  return { logout, isPending };
}

export function useUser() {
  const { isLoading, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  return { isLoading, user, isAuthenticated: user?.role === "authenticated" };
}
