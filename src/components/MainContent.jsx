import { useSelector } from "react-redux";
import { useState } from "react";
import { BookOpen, Code, Hash, Rocket, Search, StickyNote } from "lucide-react";
import MainNav from "./MainNav";
import SearchBar from "./SearchBar";
import ModalButton from "./ModalButton";
import NoteItems from "./NoteItems";
import { SmartNoteForm } from "./SmartNoteForm";
import MainModalForm from "./MainModalForm";

export default function MainContent({ currentNote }) {
  const { activeFolderId, activeNoteId, activeCategory } = useSelector(
    (state) => state.notes,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getActiveContent = () => {
    if (!currentNote) return [];
    if (activeCategory === "all") {
      return Object.values(currentNote.data).flat();
    }
    return currentNote.data[activeCategory] || [];
  };

  const contentToDisplay = getActiveContent();

  const filterItems = (items) => {
    if (!searchQuery.trim()) return items;

    // 1. Split the query into lowercase words and remove empty strings
    const keywords = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    return items.filter((item) => {
      // 2. Identify the target string based on the category structure
      const targetString = (
        item.label ||
        item.title ||
        item.name ||
        ""
      ).toLowerCase();

      // 3. "Every" keyword must be present in the target string
      // .includes() checks if the word exists, regardless of where it is
      return keywords.every((word) => targetString.includes(word));
    });
  };

  // 2. Determine what to display based on category AND search
  const filteredContent = filterItems(contentToDisplay);

  const categories = [
    { id: "all", label: "All", icon: <Hash size={16} /> },
    { id: "code snippets", label: "Code Snippets", icon: <Code size={16} /> },
    { id: "side projects", label: "Side Projects", icon: <Rocket size={16} /> },
    { id: "resources", label: "Resources", icon: <BookOpen size={16} /> },
    { id: "notes", label: "Just Notes", icon: <StickyNote size={16} /> },
  ];

  return (
    <main className="flex-1 h-full bg-white dark:bg-slate-900 lg:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col overflow-hidden">
      <MainNav />

      <section className="flex-1 p-10 overflow-y-auto no-scrollbar relative">
        {currentNote ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-start mb-6">
              <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100">
                {currentNote.title}
              </h1>

              {/* Render Form as Modal Button if data exists */}
              {contentToDisplay.length > 0 && (
                <ModalButton setIsModalOpen={setIsModalOpen} />
              )}
            </div>

            {/* SEARCH BAR SECTION */}
            {contentToDisplay.length > 0 && (
              <SearchBar
                activeCategory={activeCategory}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
            {filteredContent.length > 0 ? (
              <div className="w-full">
                {" "}
                {/* Parent wrapper */}
                {activeCategory === "all" ? (
                  // GROUPED VIEW (Category headers + Grid for each)
                  <div className="space-y-10">
                    {categories
                      .filter((c) => c.id !== "all")
                      .map((cat) => {
                        const items = filterItems(
                          currentNote.data[cat.id] || [],
                        );
                        if (items.length === 0) return null;
                        return (
                          <div key={cat.id} className="space-y-4">
                            {/* Category Header with Badge */}
                            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                              <div className="text-cyan-500">{cat.icon}</div>
                              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                                {cat.label}
                              </span>
                              {/* The Count Badge */}
                              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                {items.length}
                              </span>
                              <div className="flex-1 h-[1px] bg-gradient-to-r from-slate-100 dark:from-slate-800 to-transparent"></div>
                            </div>

                            {/* GRID FOR ITEMS */}
                            <NoteItems
                              filteredContent={items}
                              activeCategory={cat.id}
                            />
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  /* Regular Category View Header (Optional) */
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-6">
                      <span className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
                        Showing {filteredContent.length} items
                      </span>
                    </div>
                    <NoteItems
                      filteredContent={filteredContent}
                      activeCategory={activeCategory}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center">
                {contentToDisplay.length > 0 ? (
                  <>
                    <Search
                      size={48}
                      className="text-slate-200 dark:text-slate-800 mb-4"
                    />
                    <p className="text-slate-400 text-sm font-medium">
                      No results found for "{searchQuery}"
                    </p>
                    <button
                      onClick={() => setSearchQuery("")}
                      className="mt-2 text-cyan-500 text-xs font-bold hover:underline cursor-pointer"
                    >
                      Clear Search
                    </button>
                  </>
                ) : (
                  <SmartNoteForm
                    activeCategory={activeCategory}
                    activeNoteId={activeNoteId}
                    activeFolderId={activeFolderId}
                  />
                )}
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
          <MainModalForm setIsModalOpen={setIsModalOpen}>
            <SmartNoteForm
              activeFolderId={activeFolderId}
              activeNoteId={activeNoteId}
              activeCategory={activeCategory}
              onSuccess={() => setIsModalOpen(false)}
            />
          </MainModalForm>
        )}
      </section>
    </main>
  );
}
