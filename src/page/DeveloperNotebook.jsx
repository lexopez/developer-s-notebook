import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Folder,
  FileText,
  Code,
  Rocket,
  BookOpen,
  StickyNote,
  Hash,
  Moon,
  Sun,
} from "lucide-react";
import {
  setActiveFolder,
  setCategory,
  setActiveNote,
  toggleTheme,
} from "../store/notesSlice";

const DeveloperNotebook = () => {
  const dispatch = useDispatch();
  const {
    folders,
    notes,
    activeFolderId,
    activeNoteId,
    activeCategory,
    theme,
  } = useSelector((state) => state.notes);

  // Sync theme with the DOM
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const categories = [
    { id: "all", label: "All", icon: <Hash size={16} /> },
    { id: "code snippets", label: "Code Snippets", icon: <Code size={16} /> },
    { id: "side projects", label: "Side Projects", icon: <Rocket size={16} /> },
    { id: "resources", label: "Resources", icon: <BookOpen size={16} /> },
    { id: "notes", label: "Just Notes", icon: <StickyNote size={16} /> },
  ];

  const filteredNotes = notes.filter((n) => n.folderId === activeFolderId);

  // Logic to find what to show
  const notesInFolder = notes.filter((n) => n.folderId === activeFolderId);
  const displayNotes =
    activeCategory === "all"
      ? notesInFolder
      : notesInFolder.filter((n) => n.category === activeCategory);
  const currentNote = notes.find((n) => n.id === activeNoteId);

  return (
    <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden px-[10vw] py-[10vh]">
      {/* Theme Toggle Button - Top Right */}
      <div className="absolute top-6 right-8">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform"
        >
          {theme === "light" ? (
            <Moon size={20} className="text-slate-600" />
          ) : (
            <Sun size={20} className="text-yellow-400" />
          )}
        </button>
      </div>

      <div className="w-full h-full flex gap-4">
        {/* LEFT BOX: Notes List (15%) */}
        <aside className="w-[15%] h-full overflow-y-auto pr-2">
          <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 px-2">
            {folders.find((f) => f.id === activeFolderId)?.name || "Notes"}
          </h3>
          <div className="space-y-1">
            {displayNotes.map((note) => (
              <button
                key={note.id}
                onClick={() => dispatch(setActiveNote(note.id))}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  activeNoteId === note.id
                    ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm"
                    : "border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/30"
                }`}
              >
                <span
                  className={`text-sm font-medium block truncate ${
                    activeNoteId === note.id
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {note.title}
                </span>
              </button>
            ))}
          </div>
        </aside>

        {/* MAIN BOX: Editor (70%) */}
        <main className="w-[70%] h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden">
          <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex gap-2 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => dispatch(setCategory(cat.id))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeCategory === cat.id
                      ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  {cat.icon}
                  {cat.label}
                </button>
              ))}
            </div>
          </nav>

          <section className="flex-1 p-10 overflow-y-auto">
            {currentNote ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-6">
                  {currentNote.title}
                </h1>
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                  <pre className="text-slate-600 dark:text-slate-400 font-mono whitespace-pre-wrap">
                    {currentNote.content}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                <p>Select a note to view content</p>
              </div>
            )}
          </section>
          <section className="flex-1 p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">
              Select a note...
            </h1>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              Your documentation environment is ready.
            </p>
          </section>
        </main>

        {/* RIGHT BOX: Folders (15%) */}
        <aside className="w-[15%] h-full overflow-y-auto pl-2">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 px-2">
            Folders
          </h3>
          <div className="space-y-1">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => dispatch(setActiveFolder(folder.id))}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                  activeFolderId === folder.id
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                }`}
              >
                <Folder
                  size={20}
                  fill={activeFolderId === folder.id ? "currentColor" : "none"}
                />
                <span className="text-sm">{folder.name}</span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DeveloperNotebook;
