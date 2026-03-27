import React, { useEffect, useState } from "react";
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
  Plus,
  X,
  Check,
  Trash2,
  Edit3,
  MoreVertical,
} from "lucide-react";
import {
  setActiveFolder,
  setCategory,
  setActiveNote,
  toggleTheme,
  addNote,
  addFolder,
  deleteFolder,
  renameFolder,
  deleteNote,
  renameNote,
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

  const [isAddingNote, setIsAddingNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [menuConfig, setMenuConfig] = useState({ id: null, x: 0, y: 0 });

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

  // Logic to find what to show
  // ADD THIS: Sidebar only cares about the folder
  const sidebarNotes = notes.filter((n) => n.folderId === activeFolderId);
  const currentNote = notes.find((n) => n.id === activeNoteId);

  // Helper to get the specific list to display in the main box
  const getActiveContent = () => {
    if (!currentNote) return [];
    if (activeCategory === "all") {
      // Combine all categories into one list for "All" view
      return Object.values(currentNote.data).flat();
    }
    return currentNote.data[activeCategory] || [];
  };

  const contentToDisplay = getActiveContent();

  const handleOpenMenu = (e, id) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    // Position the menu to the left of the button to keep it inside the sidebar area
    setMenuConfig({ id, x: rect.left - 130, y: rect.top });
  };

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
        <aside className="w-[15%] h-full flex flex-col pr-2">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              {folders.find((f) => f.id === activeFolderId)?.name || "Notes"}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAddingNote(true);
              }}
              className="text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
            >
              {isAddingNote ? <X size={20} /> : <Plus size={20} />}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar space-y-1 h-full">
            {isAddingNote && (
              <div className="p-2 mb-2 animate-in fade-in zoom-in-95 duration-200">
                <input
                  autoFocus
                  className="w-full bg-white dark:bg-slate-800 border border-blue-400 rounded-lg p-2 text-sm outline-none text-white"
                  placeholder="Note title..."
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  onBlur={(e) => {
                    e.stopPropagation();
                    setIsAddingNote(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (!newNoteTitle || !activeFolderId) return;
                      dispatch(addNote(newNoteTitle));
                      setIsAddingNote(false);
                      setNewNoteTitle("");
                    }
                  }}
                />
              </div>
            )}
            {sidebarNotes.map((note) => (
              <div key={note.id} className="group relative">
                {editingId === note.id ? (
                  <input
                    autoFocus
                    className="w-full bg-white dark:bg-slate-800 border border-blue-500 rounded-xl p-3 text-sm outline-none"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        dispatch(renameNote({ id: note.id, name: editValue }));
                        setEditingId(null);
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center">
                    <button
                      onClick={() => dispatch(setActiveNote(note.id))}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        activeNoteId === note.id
                          ? "bg-blue-50 dark:bg-blue-900/30 text-cyan-600 dark:text-cyan-400 font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <FileText size={20} />
                      <span className="text-sm font-medium block truncate">
                        {note.title}
                      </span>
                    </button>
                    {/* The Ellipsis Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenMenu(e, note.id);
                      }}
                      className="absolute right-2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {/* The Dropdown Menu */}
                    {menuConfig.id && (
                      <>
                        <div
                          className="fixed inset-0 z-60"
                          onClick={() =>
                            setMenuConfig({ id: null, x: 0, y: 0 })
                          }
                        />
                        <div
                          style={{
                            top: `${menuConfig.y}px`,
                            left: `${menuConfig.x}px`,
                          }}
                          className="fixed w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl z-70 py-1 animate-in fade-in zoom-in-95 duration-100"
                        >
                          <button
                            onClick={() => {
                              setEditingId(menuConfig.id);
                              const note = sidebarNotes.find(
                                (n) => n.id === menuConfig.id,
                              );
                              setEditValue(note?.title || "");
                              setMenuConfig({ id: null, x: 0, y: 0 });
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                          >
                            <Edit3 size={14} /> Rename
                          </button>
                          <button
                            onClick={() => {
                              dispatch(deleteNote(menuConfig.id));
                              setMenuConfig({ id: null, x: 0, y: 0 });
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg cursor-pointer"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
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
                <div className="grid gap-4">
                  {contentToDisplay.map((item) => (
                    <div
                      key={item.id}
                      className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800"
                    >
                      {/* Render Code Snippets */}
                      {item.code && (
                        <div>
                          <span className="text-[10px] font-bold text-blue-500 uppercase mb-2 block">
                            {item.label}
                          </span>
                          <pre className="text-sm font-mono text-slate-600 dark:text-slate-400">
                            {item.code}
                          </pre>
                        </div>
                      )}

                      {/* Render Projects */}
                      {item.status && (
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-slate-700 dark:text-slate-200">
                            {item.name}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            {item.status}
                          </span>
                        </div>
                      )}

                      {/* Render General Notes */}
                      {item.text && (
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-4 border-blue-500 pl-4">
                          "{item.text}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400">
                <p>Select a note to view content</p>
              </div>
            )}
          </section>
        </main>

        {/* RIGHT BOX: Folders (15%) */}
        <aside className="w-[15%] h-full overflow-y-auto pl-2">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Folders
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsAddingFolder(true);
              }}
              className="text-slate-400 hover:text-blue-500 transition-colors cursor-pointer"
            >
              {isAddingFolder ? <X size={20} /> : <Plus size={20} />}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1">
            {isAddingFolder && (
              <div className="p-2 mb-2">
                <input
                  autoFocus
                  className="w-full bg-slate-200 dark:bg-slate-800 rounded-lg p-2 text-sm outline-none border-b-2 border-blue-500 text-white"
                  placeholder="Folder name..."
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onBlur={(e) => {
                    e.stopPropagation();
                    setIsAddingFolder(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (!newFolderName) return;
                      dispatch(addFolder(newFolderName));
                      setIsAddingFolder(false);
                      setNewFolderName("");
                    }
                  }}
                />
              </div>
            )}
            {folders.map((folder) => (
              <div key={folder.id} className="group relative">
                {editingId === folder.id ? (
                  <input
                    autoFocus
                    className="w-full bg-white dark:bg-slate-800 border border-blue-500 rounded-xl p-3 text-sm outline-none"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => setEditingId(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        dispatch(
                          renameFolder({ id: folder.id, name: editValue }),
                        );
                        setEditingId(null);
                      }
                    }}
                  />
                ) : (
                  <div className="flex items-center">
                    <button
                      onClick={() => dispatch(setActiveFolder(folder.id))}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                        activeFolderId === folder.id
                          ? "bg-blue-50 dark:bg-blue-900/30 text-cyan-600 dark:text-cyan-400 font-semibold"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      <Folder
                        size={20}
                        fill={
                          activeFolderId === folder.id ? "currentColor" : "none"
                        }
                      />
                      <span className="text-sm font-medium block truncate">
                        {folder.name}
                      </span>
                    </button>

                    {/* Actions appear on hover */}
                    <div className="absolute right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-sm p-1 rounded-lg">
                      <button
                        onClick={() => {
                          setEditingId(folder.id);
                          setEditValue(folder.name);
                        }}
                        className="p-1 hover:text-blue-500 text-slate-400"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => dispatch(deleteFolder(folder.id))}
                        className="p-1 hover:text-red-500 text-slate-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              // <button
              //   key={folder.id}
              //   onClick={() => dispatch(setActiveFolder(folder.id))}
              //   className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              //     activeFolderId === folder.id
              //       ? "bg-blue-50 dark:bg-blue-900/30 text-cyan-600 dark:text-cyan-400 font-semibold"
              //       : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
              //   }`}
              // >
              //   <Folder
              //     size={20}
              //     fill={activeFolderId === folder.id ? "currentColor" : "none"}
              //   />
              //   <span className="text-sm">{folder.name}</span>
              // </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DeveloperNotebook;
