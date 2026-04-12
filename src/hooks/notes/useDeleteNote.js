import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote as deleteNoteApi } from "@/service/apiNotes";
import toast from "react-hot-toast";

export function useDeleteNote() {
  const queryClient = useQueryClient();

  const {
    mutate: removeNote,
    error,
    isPending,
    variables,
  } = useMutation({
    mutationFn: deleteNoteApi,

    // 1. Triggered the moment removeNote(id) is called
    onMutate: async (noteId) => {
      // Cancel any outgoing refetches for "notes" so they don't overwrite our update
      await queryClient.cancelQueries({ queryKey: ["notes"] });

      // Snapshot the current notes from the cache
      const previousNotes = queryClient.getQueryData(["notes"]);

      // Optimistically update the cache by filtering out the deleted note
      queryClient.setQueryData(["notes"], (old) =>
        old?.filter((note) => note.id !== noteId),
      );

      // Return the snapshot to context for rollback in case of error
      return { previousNotes };
    },

    // 2. If the mutation fails
    onError: (err, noteId, context) => {
      // Revert the cache back to the snapshot
      queryClient.setQueryData(["notes"], context.previousNotes);
      toast.error("Failed to delete note. It has been restored.");
    },

    // 3. Always refetch after error or success to ensure sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note label deleted!");
    },
  });

  return { removeNote, error, isPending, variables };
}
