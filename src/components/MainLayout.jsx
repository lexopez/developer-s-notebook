import { FileText, Folder, Plus } from "lucide-react";
import {
  addFolder,
  addNote,
  deleteFolder,
  deleteNote,
  renameFolder,
  renameNote,
  setActiveFolder,
  setActiveNote,
} from "../store/notesSlice";
import { useDispatch, useSelector } from "react-redux";
import { SidebarList } from "./Sidebar";
import MainContent from "./MainContent";
import MobileHeader from "./MobileHeader";
import { useState } from "react";
import MobileDrawer from "./MobileDrawer";

export const MainLayout = () => {
  const dispatch = useDispatch();
  const { folders, notes, activeFolderId, activeNoteId } = useSelector(
    (state) => state.notes,
  );

  const sidebarNotes = notes.filter((n) => n.folderId === activeFolderId);
  const currentNote = notes.find((n) => n.id === activeNoteId);

  // Mobile UI State
  const [activeDrawer, setActiveDrawer] = useState(null); // 'folders' | 'notes' | 'menu' | null
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden flex flex-col lg:flex-row lg:px-[5vw] lg:py-[5vh]">
      {/* MOBILE HEADER */}
      <MobileHeader />

      {/* LEFT SIDEBAR: NOTES (Hidden on mobile) */}
      <aside className="hidden lg:flex w-[18%] flex-col p-4">
        {currentNote && currentNote.length !== 0 && (
          <SidebarList
            title="Note Labels"
            items={sidebarNotes}
            activeId={activeNoteId}
            Icon={FileText}
            placeholder="New note..."
            onSelect={(id) => dispatch(setActiveNote(id))}
            onAdd={(name) =>
              dispatch(addNote({ id: Date.now().toString(), title: name }))
            }
            onRename={(id, name) => dispatch(renameNote({ id, name }))}
            onDelete={(id) => dispatch(deleteNote(id))}
          />
        )}
      </aside>

      {/* MAIN EDITOR (Full width on mobile) */}
      <MainContent
        currentNote={currentNote}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />

      {/* RIGHT SIDEBAR: FOLDERS (Hidden on mobile) */}
      <aside className="hidden lg:flex w-[18%] flex-col p-4">
        {folders.length !== 0 && (
          <SidebarList
            title="Folders"
            items={folders}
            activeId={activeFolderId}
            Icon={Folder}
            placeholder="New folder..."
            onSelect={(id) => dispatch(setActiveFolder(id))}
            onAdd={(name) =>
              dispatch(addFolder({ id: Date.now().toString(), name }))
            }
            onRename={(id, name) => dispatch(renameFolder({ id, name }))}
            onDelete={(id) => dispatch(deleteFolder(id))}
          />
        )}
      </aside>

      {/* MOBILE BOTTOM NAV (Visible only on mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2 flex justify-around items-center z-50">
        <button
          className={`p-3 ${activeDrawer === "folders" ? "text-cyan-500" : "text-slate-400"}`}
          onClick={() => setActiveDrawer("folders")}
        >
          <Folder size={24} />
        </button>
        <button
          className={`p-4 bg-cyan-600 text-white rounded-2xl ${isModalOpen ? "-translate-y-4" : ""} shadow-lg`}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={24} />
        </button>
        <button
          className={`p-3 ${activeDrawer === "notes" ? "text-cyan-500" : "text-slate-400"}`}
          onClick={() => setActiveDrawer("notes")}
        >
          <FileText size={24} />
        </button>
      </nav>

      {/* --- MOBILE DRAWERS --- */}

      {/* Folder Drawer */}
      <MobileDrawer
        isOpen={activeDrawer === "folders"}
        onClose={() => setActiveDrawer(null)}
        title="Manage Folders"
      >
        <SidebarList
          items={folders}
          activeId={activeFolderId}
          Icon={Folder}
          onSelect={(id) => {
            dispatch(setActiveFolder(id));
            setActiveDrawer(null);
          }}
          onAdd={(name) =>
            dispatch(addFolder({ id: Date.now().toString(), name }))
          }
          onRename={(id, name) => dispatch(renameFolder({ id, name }))}
          onDelete={(id) => dispatch(deleteFolder(id))}
        />
      </MobileDrawer>

      {/* Notes Drawer */}
      <MobileDrawer
        isOpen={activeDrawer === "notes"}
        onClose={() => setActiveDrawer(null)}
        title="Select Note"
      >
        <SidebarList
          items={sidebarNotes}
          activeId={activeNoteId}
          Icon={FileText}
          onSelect={(id) => {
            dispatch(setActiveNote(id));
            setActiveDrawer(null);
          }}
          onAdd={(name) =>
            dispatch(addNote({ id: Date.now().toString(), title: name }))
          }
          onRename={(id, name) => dispatch(renameNote({ id, name }))}
          onDelete={(id) => dispatch(deleteNote(id))}
        />
      </MobileDrawer>
    </div>
  );
};
