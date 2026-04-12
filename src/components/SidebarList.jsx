import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import { useSelector } from "react-redux";

import NoteLists from "./NoteLists";
import { useAddFolder } from "../hooks/folders/useAddFolder";
import { useAddNote } from "../hooks/notes/useAddNote";
import { useUpdateNoteFolderId } from "../hooks/notes/useUpdateNoteFolderId";
import { useFolders } from "../hooks/folders/useFolders";
import { useNotes } from "../hooks/notes/useNotes";

export const SidebarList = ({ title, isDropTarget = true }) => {
  const { createFolder } = useAddFolder();
  const { createNote } = useAddNote();
  const { folderizeUnfolderizeNote } = useUpdateNoteFolderId();

  const { folders, isLoading: isFetchingFolders } = useFolders();
  const { notes, isLoading: isFetchingNotes } = useNotes();

  const { activeFolderId } = useSelector((state) => state.notes);

  const [isDragging1, setIsDragging1] = useState(false);
  const [isDragging2, setIsDragging2] = useState(false);
  const dragCounter = useRef(0);

  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");

  // Logic to separate notes with and without folders for the "Note Labels" sidebar
  let notesWithFolder = [];
  let notesWithoutFolder = [];
  let currentFolder = null;
  if (title === "Note Labels") {
    const sidebarNotes = notes?.filter((n) => n.folder_id === activeFolderId);
    notesWithFolder =
      sidebarNotes?.length > 0
        ? sidebarNotes.filter((i) => i.folder_id !== null)
        : [];
    notesWithoutFolder =
      notes?.length > 0 ? notes?.filter((i) => i.folder_id === null) : [];
    currentFolder = folders?.find((i) => i.id === activeFolderId);
  }

  const handleAdd = (e) => {
    if (e.key === "Enter" && newValue.trim() && newValue.length <= 50) {
      if (title === "Note Labels") {
        createNote({ title: newValue, folderId: activeFolderId });
      } else {
        createFolder({ folderName: newValue });
      }
      setNewValue("");
      setIsAdding(false);
    }
  };

  const handleDragStart = (e, noteId) => {
    e.dataTransfer.setData("noteId", noteId);
  };

  const handleDropAddNoteToFolder = (e) => {
    e.preventDefault();
    const noteId = e.dataTransfer.getData("noteId");
    folderizeUnfolderizeNote({ noteId, folderId: activeFolderId });
  };

  const handleDropRemoveNoteFromFolder = (e) => {
    e.preventDefault();
    const noteId = e.dataTransfer.getData("noteId");
    folderizeUnfolderizeNote({ noteId, folderId: null });
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

        {!isFetchingFolders && !isFetchingNotes && (
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
                <div
                  className={`space-y-1 ${isDragging1 ? "border border-slate-100 dark:border-slate-800" : ""}`}
                  onDragOver={(e) => {
                    isDropTarget && e.preventDefault();
                  }}
                  onDragEnter={() => {
                    setIsDragging1(true);
                    dragCounter.current++;
                  }}
                  onDragLeave={() => {
                    dragCounter.current--;
                    if (dragCounter.current === 0) {
                      setIsDragging1(false);
                    }
                  }}
                >
                  {currentFolder && (
                    <p className="text-[10px] font-light text-slate-400 capitalize tracking-widest truncate mb-2 pl-4">
                      current folder:{" "}
                      <span className="font-bold text-cyan-600">
                        {currentFolder?.name}
                      </span>
                    </p>
                  )}
                  {notesWithFolder.length > 0 && (
                    <NoteLists
                      items={notesWithFolder}
                      title={title}
                      onDragStart={(e, id) => handleDragStart(e, id)}
                      onDrop={(e) => {
                        handleDropAddNoteToFolder(e);
                        setIsDragging1(false);
                        dragCounter.current = 0;
                      }}
                    />
                  )}
                  {notesWithFolder.length === 0 && activeFolderId && (
                    <p
                      className="text-slate-400 text-sm font-medium px-4"
                      onDrop={(e) => {
                        handleDropAddNoteToFolder(e);
                        setIsDragging1(false);
                        dragCounter.current = 0;
                      }}
                    >
                      Create new Note label using the plus button or Drag and
                      drop here existing notes from unfolderized Note labels to
                      add them to th current folder.
                    </p>
                  )}
                </div>

                {notesWithoutFolder.length > 0 && activeFolderId && (
                  <div className="border-b border-slate-200 my-5" />
                )}

                {/* Notes without Folder */}
                {notesWithoutFolder.length > 0 && (
                  <div
                    className={`space-y-1 ${isDragging2 ? "border border-slate-100 dark:border-slate-800" : ""}`}
                    onDragOver={(e) => {
                      isDropTarget && e.preventDefault();
                    }}
                    onDragEnter={() => {
                      setIsDragging2(true);
                      dragCounter.current++;
                    }}
                    onDragLeave={() => {
                      dragCounter.current--;
                      if (dragCounter.current === 0) {
                        setIsDragging2(false);
                      }
                    }}
                  >
                    <p className="text-[10px] font-light text-slate-400 capitalize tracking-widest truncate mb-2 pl-4">
                      Unfolderized Notes
                    </p>
                    <NoteLists
                      items={notesWithoutFolder}
                      title={title}
                      onDragStart={(e, id) => handleDragStart(e, id)}
                      onDrop={(e) => {
                        handleDropRemoveNoteFromFolder(e);
                        setIsDragging2(false);
                        dragCounter.current = 0;
                      }}
                    />
                  </div>
                )}

                {notesWithoutFolder.length === 0 && !activeFolderId && (
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
        )}
      </div>
    </>
  );
};
