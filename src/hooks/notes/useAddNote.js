import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNote as addNoteApi } from "@/service/apiNotes";
import { useDispatch } from "react-redux";
import { setActiveNote } from "../../store/notesStore";
import toast from "react-hot-toast";
import { useUser } from "../user/useAuth";

export function useAddNote() {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { user } = useUser();

  const {
    mutate: createNote,
    error,
    isPending,
  } = useMutation({
    mutationFn: (vars) => addNoteApi({ ...vars, userId: user.id }),

    // 1. Snapshot and update cache immediately
    onMutate: async (newNoteVariables) => {
      // Cancel refetches to prevent overwriting our optimistic data
      await queryClient.cancelQueries({ queryKey: ["notes"] });

      // Save previous state for rollback
      const previousNotes = queryClient.getQueryData(["notes"]);

      // Optimistically add the note
      queryClient.setQueryData(["notes"], (old = []) => [
        {
          id: "temp-note-id",
          title: newNoteVariables.title,
          folder_id: newNoteVariables.folderId || null,
          user_id: user.id,
          data: newNoteVariables.itemData || {
            "code snippets": [],
            "side projects": [],
            resources: [],
            notes: [],
          },
        },
        ...old,
      ]);

      return { previousNotes };
    },

    // 2. Handle Success
    onSuccess: (newNoteFromServer, variables) => {
      // Replace optimistic list with actual DB data
      queryClient.invalidateQueries({ queryKey: ["notes"] });

      // Select the newly created note using the real ID
      dispatch(setActiveNote(newNoteFromServer.id));

      variables.itemData
        ? toast.success("Note created!")
        : toast.success("Note label created!");
    },

    // 3. Handle Rollback
    onError: (err, variables, context) => {
      queryClient.setQueryData(["notes"], context.previousNotes);
      toast.error(err.message || "Failed to create note");
    },

    // 4. Ensure sync even if success/error logic is complex
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  return { createNote, error, isPending };
}
