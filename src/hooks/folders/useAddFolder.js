import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addFolder as addFolderApi } from "@/service/apiFolders";
import { useAddNote } from "../notes/useAddNote";
import { useDispatch } from "react-redux";
import { setActiveFolder, setActiveNote } from "../../store/notesStore";
import toast from "react-hot-toast";
import { useUser } from "../user/useAuth";

export function useAddFolder() {
  const queryClient = useQueryClient();
  const { createNote } = useAddNote();
  const dispatch = useDispatch();
  const { user } = useUser();

  const {
    mutate: createFolder,
    error,
    isPending,
  } = useMutation({
    mutationFn: (vars) =>
      addFolderApi({ name: vars.folderName, userId: user.id }),

    onMutate: async (vars) => {
      await queryClient.cancelQueries({ queryKey: ["folders"] });
      const previousFolders = queryClient.getQueryData(["folders"]);

      // Optimistically add the folder with a temporary ID
      queryClient.setQueryData(["folders"], (old) => [
        {
          id: "temp-id",
          name: vars.folderName,
          user_id: user.id,
          created_at: new Date().toISOString(),
        },
        ...old,
      ]);

      return { previousFolders };
    },

    onSuccess: (newFolder, variables) => {
      // 1. Replace the optimistic list with the real data from Supabase
      queryClient.invalidateQueries({ queryKey: ["folders"] });

      // 2. Update Global UI State
      dispatch(setActiveFolder(newFolder.id));
      !variables.noteTitle && dispatch(setActiveNote(null));

      // 3. Chain the Note creation if a title was provided
      if (variables.noteTitle) {
        createNote({
          title: variables.noteTitle,
          folderId: newFolder.id,
          itemData: variables.itemData,
        });
      } else {
        toast.success("Folder created!");
      }
    },

    onError: (err, variables, context) => {
      queryClient.setQueryData(["folders"], context.previousFolders);
      toast.error(err.message || "Failed to create folder");
    },
  });

  return { createFolder, error, isPending };
}
