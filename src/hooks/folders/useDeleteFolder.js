import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFolder } from "@/service/apiFolders";
import { toast } from "react-hot-toast"; // Or your preferred toast library

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  const {
    mutate: removeFolder,
    error,
    isPending,
    variables,
  } = useMutation({
    mutationFn: deleteFolder,

    // 1. When mutation starts
    onMutate: async (folderId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["folders"] });
      await queryClient.cancelQueries({ queryKey: ["notes"] });

      // Snapshot the previous values
      const previousFolders = queryClient.getQueryData(["folders"]);
      const previousNotes = queryClient.getQueryData(["notes"]);

      // Optimistically update Folders: remove the deleted folder
      queryClient.setQueryData(["folders"], (old) =>
        old?.filter((folder) => folder.id !== folderId),
      );

      // Optimistically update Notes: remove all notes belonging to that folder
      queryClient.setQueryData(["notes"], (old) =>
        old?.filter((note) => note.folder_id !== folderId),
      );

      // Return context with snapshots to rollback if it fails
      return { previousFolders, previousNotes };
    },

    // 2. If the mutation fails, use the context we returned above to rollback
    onError: (err, folderId, context) => {
      queryClient.setQueryData(["folders"], context.previousFolders);
      queryClient.setQueryData(["notes"], context.previousNotes);
      toast.error("Failed to delete folder. Reverting...");
    },

    // 3. Always refetch after error or success to keep server/client in sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Folder deleted!");
    },
  });

  return { removeFolder, error, isPending, variables };
}
