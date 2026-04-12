import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renameNote } from "@/service/apiNotes";
import toast from "react-hot-toast";

export function useRenameNote() {
  const queryClient = useQueryClient();
  const {
    mutate: changeNoteName,
    error,
    isPending,
  } = useMutation({
    mutationFn: renameNote,

    // 1. When changeFolderName({ id, name }) is called
    onMutate: async ({ id, title }) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic name
      await queryClient.cancelQueries({ queryKey: ["notes"] });

      // Snapshot the previous folders
      const previousNotes = queryClient.getQueryData(["notes"]);

      // Optimistically update the name in the cache
      queryClient.setQueryData(["notes"], (old) =>
        old?.map((note) => (note.id === id ? { ...note, title } : note)),
      );

      // Return context for rollback
      return { previousNotes };
    },

    // 2. If the Supabase update fails
    onError: (err, variables, context) => {
      // Roll back to the original name
      queryClient.setQueryData(["notes"], context.previousNotes);
      toast.error("Failed to rename note label. Reverting...");
    },

    // 3. Always refetch to ensure the client is perfectly synced with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note label renamed!");
    },
  });

  return { changeNoteName, error, isPending };
}
