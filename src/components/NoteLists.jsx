import { useState } from "react";
import EditButton from "./EditButton";
import DeleteButton from "./DeleteButton";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteFolder,
  deleteNote,
  renameFolder,
  renameNote,
  setActiveDrawer,
  setActiveFolder,
  setActiveNote,
} from "../store/notesSlice";
import { FileText, Folder, GripVertical } from "lucide-react";

export default function NoteLists({ items, title, onDragStart, onDrop }) {
  const dispatch = useDispatch();
  const { activeNoteId, activeFolderId } = useSelector((state) => state.notes);

  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const activeId = title === "Note Labels" ? activeNoteId : activeFolderId;
  const Icon = title === "Note Labels" ? FileText : Folder;

  const handleSelect = (id) => {
    if (title === "Note Labels") {
      dispatch(setActiveNote(id));
    } else {
      dispatch(setActiveFolder(id));
    }
    dispatch(setActiveDrawer(null));
  };

  const handleDelete = (id) => {
    if (title === "Note Labels") {
      dispatch(deleteNote(id));
    } else {
      dispatch(deleteFolder(id));
    }
  };

  const handleRename = (id, e) => {
    if (e.key === "Enter" && editValue.trim() && editValue.length <= 50) {
      title === "Note Labels"
        ? dispatch(renameNote({ id, name: editValue }))
        : dispatch(renameFolder({ id, name: editValue }));
      setEditingId(null);
    }
  };

  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative "
          draggable={title === "Note Labels"}
          onDragStart={(e) => onDragStart(e, item.id)}
          onDrop={(e) => onDrop(e, item.id)}
        >
          {editingId === item.id ? (
            <>
              <input
                autoFocus
                maxLength={50}
                className="w-full bg-white dark:text-slate-200 dark:bg-slate-800 border border-cyan-500 rounded-xl p-3 text-sm outline-none"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => handleRename(item.id, e)}
                onBlur={() => setEditingId(null)}
              />
              {editValue.length >= 40 && (
                <p className="text-[9px] text-orange-500 mt-1 px-1">
                  {50 - editValue.length} characters remaining
                </p>
              )}
            </>
          ) : (
            <div className="flex items-center">
              <button
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center gap-3 p-3 transition-all ${
                  activeId === item.id
                    ? "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                }`}
              >
                {title === "Note Labels" && (
                  <GripVertical
                    size={16}
                    className="text-slate-400 cursor-grab active:cursor-grabbing dark:active:bg-slate-800/50 rounded"
                  />
                )}
                <Icon size={20} className="shrink-0" />
                <span className="text-sm truncate pr-4 capitalize">
                  {item.title || item.name}
                </span>
              </button>
              <div className="absolute right-2 flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity lg:bg-slate-50/80 lg:dark:bg-slate-950/80 backdrop-blur-sm p-1 rounded-lg">
                <EditButton
                  editItem={() => {
                    setEditingId(item.id);
                    setEditValue(item.title || item.name);
                  }}
                />
                <DeleteButton handleDelete={() => handleDelete(item.id)} />
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
}
