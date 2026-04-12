import { useQuery } from "@tanstack/react-query";
import { getNotes } from "@/service/apiNotes";
import { useUser } from "../user/useAuth";

// Hook to fetch all notes
export function useNotes() {
  const { user } = useUser();
  const { data, error, isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: () => getNotes(user.id),
  });

  return { notes: data, error, isLoading };
}
