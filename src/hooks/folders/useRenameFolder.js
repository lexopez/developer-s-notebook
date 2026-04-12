import { useMutation, useQueryClient } from "@tanstack/react-query";
import { renameFolder as renameFolderApi } from "@/service/apiFolders";
import toast from "react-hot-toast";

export function useRenameFolder() {
  const queryClient = useQueryClient();

  const {
    mutate: changeFolderName,
    error,
    isPending,
  } = useMutation({
    // mutationFn expects { id, name }
    mutationFn: renameFolderApi,

    // 1. When changeFolderName({ id, name }) is called
    onMutate: async ({ id, name }) => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic name
      await queryClient.cancelQueries({ queryKey: ["folders"] });

      // Snapshot the previous folders
      const previousFolders = queryClient.getQueryData(["folders"]);

      // Optimistically update the name in the cache
      queryClient.setQueryData(["folders"], (old) =>
        old?.map((folder) =>
          folder.id === id ? { ...folder, name: name } : folder,
        ),
      );

      // Return context for rollback
      return { previousFolders };
    },

    // 2. If the Supabase update fails
    onError: (err, variables, context) => {
      // Roll back to the original name
      queryClient.setQueryData(["folders"], context.previousFolders);
      toast.error("Failed to rename folder. Reverting...");
    },

    // 3. Always refetch to ensure the client is perfectly synced with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["folders"] });
      toast.success("Folder renamed!");
    },
  });

  return { changeFolderName, error, isPending };
}
