import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNoteFolderId } from "@/service/apiNotes";

export function useUpdateNoteFolderId() {
  const queryClient = useQueryClient();
  const {
    mutate: folderizeUnfolderizeNote,
    error,
    isPending,
  } = useMutation({
    mutationFn: updateNoteFolderId,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return { folderizeUnfolderizeNote, error, isPending };
}
