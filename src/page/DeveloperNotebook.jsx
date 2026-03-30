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
import { SmartNoteCreator } from "../components/SmartNoteCreator";
import { ContentItem } from "../components/ContentItem";
import { SmartNoteForm } from "../components/SmartNoteForm";

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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [menuConfig, setMenuConfig] = useState({
    id: null,
    x: 0,
    y: 0,
    type: null,
  });

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

  const sidebarNotes = notes.filter((n) => n.folderId === activeFolderId);
  const currentNote = notes.find((n) => n.id === activeNoteId);

  const getActiveContent = () => {
    if (!currentNote) return [];
    if (activeCategory === "all") {
      return Object.values(currentNote.data).flat();
    }
    return currentNote.data[activeCategory] || [];
  };

  const contentToDisplay = getActiveContent();

  // Dynamic Positioning Logic
  const handleOpenMenu = (e, id, type) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const isRightSidebar = type === "folder";

    // If it's the right sidebar, push the menu to the left of the button
    // If it's the left sidebar, also push it to the left so it stays inside the 15% width
    const xPos = isRightSidebar ? rect.left - 130 : rect.left - 130;

    setMenuConfig({ id, x: xPos, y: rect.top, type });
  };

  return (
    <div className="h-screen w-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-hidden px-[10vw] py-[10vh]">
      <div className="absolute top-6 right-8">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform cursor-pointer"
        >
          {theme === "light" ? (
            <Moon size={20} className="text-slate-600" />
          ) : (
            <Sun size={20} className="text-yellow-400" />
          )}
        </button>
      </div>

      <div className="w-full h-full flex gap-4">
        {/* LEFT SIDEBAR: NOTES */}
        <aside className="w-[15%] h-full flex flex-col">
          {sidebarNotes.length !== 0 && (
            <>
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest truncate">
                  Note label:{" "}
                  {folders.find((f) => f.id === activeFolderId)?.name ||
                    "Notes"}
                </h3>
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="text-slate-400 hover:text-cyan-500 transition-colors cursor-pointer"
                >
                  {isAddingNote ? <X size={20} /> : <Plus size={20} />}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                {isAddingNote && (
                  <div className="p-2 mb-2 animate-in fade-in zoom-in-95 duration-200">
                    <input
                      autoFocus
                      maxLength={50}
                      className="w-full bg-slate-200 dark:bg-slate-800/50 text-slate-900 dark:text-slate-200 rounded-lg p-2 text-sm outline-none border-b-2 border-cyan-500"
                      placeholder="Note label..."
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      onBlur={() => setIsAddingNote(false)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          newNoteTitle.trim() &&
                          activeFolderId &&
                          newNoteTitle.length <= 50
                        ) {
                          dispatch(
                            addNote({
                              id: Date.now().toString(),
                              title: newNoteTitle,
                            }),
                          );
                          setIsAddingNote(false);
                          setNewNoteTitle("");
                        }
                      }}
                    />
                    {newNoteTitle.length >= 40 && (
                      <p className="text-[9px] text-orange-500 mt-1 px-1">
                        {50 - newNoteTitle.length} characters remaining
                      </p>
                    )}
                  </div>
                )}

                {sidebarNotes.map((note) => (
                  <div key={note.id} className="group relative">
                    {editingId === note.id ? (
                      <>
                        <input
                          autoFocus
                          maxLength={50}
                          className="w-full bg-white dark:bg-slate-800 dark:text-slate-200 border border-cyan-500 rounded-xl p-3 text-sm outline-none"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => setEditingId(null)}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              editValue.trim() &&
                              editValue.length <= 50
                            ) {
                              dispatch(
                                renameNote({ id: note.id, name: editValue }),
                              );
                              setEditingId(null);
                            }
                          }}
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
                          onClick={() => dispatch(setActiveNote(note.id))}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                            activeNoteId === note.id
                              ? "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 font-semibold shadow-sm"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          <FileText size={20} className="shrink-0" />
                          <span className="text-sm font-medium block truncate pr-4">
                            {note.title}
                          </span>
                        </button>
                        <button
                          onClick={(e) => handleOpenMenu(e, note.id, "note")}
                          className="absolute right-2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* MAIN EDITOR */}
        <main className="w-[70%] h-full bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden">
          <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex gap-2 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl overflow-x-auto no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => dispatch(setCategory(cat.id))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>
          </nav>

          <section className="flex-1 p-10 overflow-y-auto no-scrollbar relative">
            {currentNote ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-start mb-6">
                  <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">
                    {currentNote.title}
                  </h1>

                  {/* Render Form as Modal Button if data exists */}
                  {contentToDisplay.length > 0 && (
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
                    >
                      <Plus size={18} /> Add Note
                    </button>
                  )}
                </div>

                {/* {contentToDisplay.length > 0 ? (
                  <div className="grid gap-6">
                    {activeCategory === "all"
                      ? // Grouping logic for "All" category
                        categories
                          .filter((c) => c.id !== "all")
                          .map((cat) => {
                            const items = currentNote.data[cat.id] || [];
                            if (items.length === 0) return null;
                            return (
                              <div key={cat.id} className="space-y-3">
                                <div className="flex items-center gap-2 text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                                  {cat.icon}
                                  <span className="text-[10px] font-bold uppercase tracking-widest">
                                    {cat.label}
                                  </span>
                                </div>
                                {items.map((item) => (
                                  <ContentItem
                                    key={item.id}
                                    item={item}
                                    category={cat.id}
                                  />
                                ))}
                              </div>
                            );
                          })
                      : // Regular category list
                        contentToDisplay.map((item) => (
                          <ContentItem
                            key={item.id}
                            item={item}
                            category={activeCategory}
                          />
                        ))}
                  </div>
                ) : (
                  <SmartNoteForm
                    activeCategory={activeCategory}
                    activeNoteId={activeNoteId}
                    activeFolderId={activeFolderId}
                  />
                )} */}
                {contentToDisplay.length > 0 ? (
                  <div className="w-full">
                    {" "}
                    {/* Parent wrapper */}
                    {activeCategory === "all" ? (
                      // GROUPED VIEW (Category headers + Grid for each)
                      <div className="space-y-10">
                        {categories
                          .filter((c) => c.id !== "all")
                          .map((cat) => {
                            const items = currentNote.data[cat.id] || [];
                            if (items.length === 0) return null;
                            return (
                              <div key={cat.id} className="space-y-4">
                                {/* Category Header */}
                                <div className="flex items-center gap-2 text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                                  {cat.icon}
                                  <span className="text-[10px] font-bold uppercase tracking-widest">
                                    {cat.label}
                                  </span>
                                </div>

                                {/* GRID FOR ITEMS */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {items.map((item) => (
                                    <ContentItem
                                      key={item.id}
                                      item={item}
                                      category={cat.id}
                                    />
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      // REGULAR CATEGORY VIEW (Just the grid)
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {contentToDisplay.map((item) => (
                          <ContentItem
                            key={item.id}
                            item={item}
                            category={activeCategory}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Render Form as Regular Form if no data */
                  <div className="flex justify-center w-full">
                    <SmartNoteForm
                      activeCategory={activeCategory}
                      activeNoteId={activeNoteId}
                      activeFolderId={activeFolderId}
                    />
                  </div>
                )}
              </div>
            ) : (
              /* No Note or No Folder selected - Render Global Form */
              <div className="h-full flex items-center justify-center">
                <SmartNoteForm
                  activeFolderId={activeFolderId}
                  activeNoteId={activeNoteId}
                  activeCategory={activeCategory}
                />
              </div>
            )}

            {/* Modal Version of the Form */}
            {isModalOpen && (
              <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 ">
                <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-3xl p-8 relative dark:border-slate-200">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X size={24} />
                  </button>
                  <SmartNoteForm
                    activeFolderId={activeFolderId}
                    activeNoteId={activeNoteId}
                    activeCategory={activeCategory}
                    onSuccess={() => setIsModalOpen(false)}
                  />
                </div>
              </div>
            )}
          </section>
        </main>

        {/* RIGHT SIDEBAR: FOLDERS */}
        <aside className="w-[15%] h-full flex flex-col">
          {folders.length !== 0 && (
            <>
              <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  Folders
                </h3>
                <button
                  onClick={() => setIsAddingFolder(true)}
                  className="text-slate-400 hover:text-cyan-500 transition-colors cursor-pointer"
                >
                  {isAddingFolder ? <X size={20} /> : <Plus size={20} />}
                </button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
                {isAddingFolder && (
                  <div className="p-2 mb-2 animate-in fade-in zoom-in-95 duration-200">
                    <input
                      autoFocus
                      maxLength={50}
                      className="w-full bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-lg p-2 text-sm outline-none border-b-2 border-cyan-500"
                      placeholder="Folder name..."
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onBlur={() => setIsAddingFolder(false)}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          newFolderName.trim() &&
                          newFolderName.length <= 50
                        ) {
                          dispatch(
                            addFolder({
                              id: Date.now().toString(),
                              name: newFolderName,
                            }),
                          );
                          setIsAddingFolder(false);
                          setNewFolderName("");
                        }
                      }}
                    />
                    {newFolderName.length >= 40 && (
                      <p className="text-[9px] text-orange-500 mt-1 px-1">
                        {50 - newFolderName.length} characters remaining
                      </p>
                    )}
                  </div>
                )}
                {folders.map((folder) => (
                  <div key={folder.id} className="group relative">
                    {editingId === folder.id ? (
                      <>
                        <input
                          autoFocus
                          maxLength={50}
                          className="w-full bg-white dark:bg-slate-800 dark:text-slate-200 border border-cyan-500 rounded-xl p-3 text-sm outline-none"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onBlur={() => setEditingId(null)}
                          onKeyDown={(e) => {
                            if (
                              e.key === "Enter" &&
                              editValue.trim() &&
                              editValue.length <= 50
                            ) {
                              dispatch(
                                renameFolder({
                                  id: folder.id,
                                  name: editValue,
                                }),
                              );
                              setEditingId(null);
                            }
                          }}
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
                          onClick={() => dispatch(setActiveFolder(folder.id))}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                            activeFolderId === folder.id
                              ? "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 font-semibold shadow-sm"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          <Folder
                            size={20}
                            fill={
                              activeFolderId === folder.id
                                ? "currentColor"
                                : "none"
                            }
                            className="shrink-0"
                          />
                          <span className="text-sm font-medium block truncate pr-4">
                            {folder.name}
                          </span>
                        </button>
                        <button
                          onClick={(e) =>
                            handleOpenMenu(e, folder.id, "folder")
                          }
                          className="absolute right-2 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>

      {/* THE GLOBAL SMART MENU */}
      {menuConfig.id && (
        <>
          <div
            className="fixed inset-0 z-60"
            onClick={() => setMenuConfig({ id: null, x: 0, y: 0, type: null })}
          />
          <div
            style={{ top: `${menuConfig.y}px`, left: `${menuConfig.x}px` }}
            className="fixed w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-70 py-1 animate-in fade-in zoom-in-95 duration-100 overflow-hidden"
          >
            <button
              onClick={() => {
                setEditingId(menuConfig.id);
                const target =
                  menuConfig.type === "note"
                    ? notes.find((n) => n.id === menuConfig.id)
                    : folders.find((f) => f.id === menuConfig.id);
                setEditValue(target?.title || target?.name || "");
                setMenuConfig({ id: null, x: 0, y: 0, type: null });
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
            >
              <Edit3 size={14} /> Rename
            </button>
            <button
              onClick={() => {
                menuConfig.type === "note"
                  ? dispatch(deleteNote(menuConfig.id))
                  : dispatch(deleteFolder(menuConfig.id));
                setMenuConfig({ id: null, x: 0, y: 0, type: null });
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DeveloperNotebook;
