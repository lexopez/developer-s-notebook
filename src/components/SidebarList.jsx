import { Plus, X } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NoteLists from "./NoteLists";
import { addFolder, addNote } from "../store/notesSlice";

export const SidebarList = ({ title }) => {
  const dispatch = useDispatch();

  const { notes, activeFolderId, folders } = useSelector(
    (state) => state.notes,
  );

  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");

  // Logic to separate notes with and without folders for the "Note Labels" sidebar
  let notesWithFolder = [];
  let notesWithoutFolder = [];
  let currentFolder = null;
  if (title === "Note Labels") {
    const sidebarNotes = notes.filter((n) => n.folderId === activeFolderId);
    notesWithFolder =
      sidebarNotes.length > 0
        ? sidebarNotes.filter((i) => i.folderId !== null)
        : [];
    notesWithoutFolder =
      notes.length > 0 ? notes.filter((i) => i.folderId === null) : [];
    currentFolder = folders.find((i) => i.id === activeFolderId);
  }

  const handleAdd = (e) => {
    if (e.key === "Enter" && newValue.trim() && newValue.length <= 50) {
      title === "Note Labels"
        ? dispatch(addNote({ id: Date.now().toString(), title: newValue }))
        : dispatch(addFolder({ id: Date.now().toString(), name: newValue }));
      setNewValue("");
      setIsAdding(false);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
            {title}
          </h3>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-slate-400 hover:text-cyan-500 cursor-pointer"
          >
            {isAdding ? <X size={20} /> : <Plus size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-1 h-full">
          {isAdding && (
            <>
              <input
                autoFocus
                maxLength={50}
                className="w-full bg-slate-200 dark:text-slate-200 dark:bg-slate-800/50 text-sm p-2 rounded-lg outline-none border-b-2 border-cyan-500 mb-2"
                placeholder={
                  title === "Note Labels"
                    ? "New note label..."
                    : "New folder..."
                }
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={handleAdd}
                onBlur={() => setIsAdding(false)}
              />
              {newValue.length >= 40 && (
                <p className="text-[9px] text-orange-500 mt-1 px-1">
                  {50 - newValue.length} characters remaining
                </p>
              )}
            </>
          )}
          {title === "Note Labels" && (
            <>
              {/* Notes with Folder */}
              {notesWithFolder.length > 0 && (
                <>
                  <p className="text-[10px] font-light text-slate-400 capitalize tracking-widest truncate mb-2 pl-4">
                    current folder: {currentFolder?.name}
                  </p>
                  <NoteLists items={notesWithFolder} title={title} />
                </>
              )}

              {notesWithFolder.length > 0 && notesWithoutFolder.length > 0 && (
                <div className="border-b border-slate-200 my-5" />
              )}

              {/* Notes without Folder */}
              {notesWithoutFolder.length > 0 && (
                <>
                  <p className="text-[10px] font-light text-slate-400 capitalize tracking-widest truncate mb-2 pl-4">
                    Without Folder
                  </p>
                  <NoteLists items={notesWithoutFolder} title={title} />
                </>
              )}

              {notes.length === 0 && (
                <p className=" text-slate-400 text-sm font-medium text-center mt-4">
                  No {title} yet. Click the plus button to add one!.
                </p>
              )}
            </>
          )}
          {title === "Folders" && (
            <>
              <NoteLists items={folders} title={title} />
              {folders.length === 0 && (
                <p className=" text-slate-400 text-sm font-medium text-center mt-4">
                  No {title} yet. Click the plus button to add one!. Folders
                  help you organize your notes.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};
