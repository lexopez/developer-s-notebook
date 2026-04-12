import { useQuery } from "@tanstack/react-query";
import { getFolders } from "@/service/apiFolders";
import { useUser } from "../user/useAuth";

// Hook to fetch all folders
export function useFolders() {
  const { user } = useUser();
  const { data, error, isLoading } = useQuery({
    queryKey: ["folders"],
    queryFn: () => getFolders(user.id),
  });
  return { folders: data, error, isLoading };
}
