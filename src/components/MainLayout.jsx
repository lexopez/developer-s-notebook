import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FileText, Folder, Plus } from "lucide-react";
import { setActiveDrawer } from "../store/notesSlice";

import { useFolders } from "../hooks/folders/useFolders";
import { useNotes } from "../hooks/notes/useNotes";
import { SidebarList } from "./SidebarList";
import MainContent from "./MainContent";
import MobileHeader from "./MobileHeader";
import MobileDrawer from "./MobileDrawer";
import SpinnerPage from "./SpinnerPage";

export const MainLayout = () => {
  const dispatch = useDispatch();
  const { activeDrawer } = useSelector((state) => state.notes);

  const { folders, isLoading: isFetchingFolders } = useFolders();
  const { notes, isLoading: isFetchingNotes } = useNotes();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isFetchingFolders || isFetchingNotes) return <SpinnerPage />;

  return (
    <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden flex flex-col lg:flex-row lg:px-[5vw] lg:py-[5vh]">
      {/* MOBILE HEADER */}
      <MobileHeader />

      {/* LEFT SIDEBAR: NOTES (Hidden on mobile) */}
      <aside className="hidden lg:flex w-[18%] flex-col p-4">
        {notes.length > 0 && <SidebarList title="Note Labels" />}
      </aside>

      {/* MAIN EDITOR (Full width on mobile) */}
      <MainContent
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        notes={notes}
      />

      {/* RIGHT SIDEBAR: FOLDERS (Hidden on mobile) */}
      <aside className="hidden lg:flex w-[18%] flex-col p-4">
        {(folders.length !== 0 || notes.length !== 0) && (
          <SidebarList title="Folders" />
        )}
      </aside>

      {/* MOBILE BOTTOM NAV (Visible only on mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-1 flex justify-around items-center z-50">
        <button
          className={`p-3 ${activeDrawer === "folders" ? "text-cyan-500" : "text-slate-400"}`}
          onClick={() => dispatch(setActiveDrawer("folders"))}
        >
          <Folder size={24} className="m-auto" />
          Folders
        </button>
        <button
          className={`p-4 bg-cyan-600 text-white rounded-2xl ${isModalOpen ? "-translate-y-4" : ""} shadow-lg`}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={24} />
        </button>
        <button
          className={`p-3 ${activeDrawer === "notes" ? "text-cyan-500" : "text-slate-400"}`}
          onClick={() => dispatch(setActiveDrawer("notes"))}
        >
          <FileText size={24} className="m-auto" />
          Notes
        </button>
      </nav>

      {/* --- MOBILE DRAWERS --- */}

      {/* Folder Drawer */}
      <MobileDrawer
        isOpen={activeDrawer === "folders"}
        onClose={() => dispatch(setActiveDrawer(null))}
        title="Manage Folders"
      >
        <SidebarList title="Folders" />
      </MobileDrawer>

      {/* Notes Drawer */}
      <MobileDrawer
        isOpen={activeDrawer === "notes"}
        onClose={() => dispatch(setActiveDrawer(null))}
        title="Select Note Label"
      >
        <SidebarList title="Note Labels" />
      </MobileDrawer>
    </div>
  );
};
