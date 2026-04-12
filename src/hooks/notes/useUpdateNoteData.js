import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNoteData } from "@/service/apiNotes";

export function useUpdateNoteData() {
  const queryClient = useQueryClient();
  const {
    mutate: editNoteData,
    error,
    isPending,
    variables,
  } = useMutation({
    mutationFn: updateNoteData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return { editNoteData, error, isPending, variables };
}
