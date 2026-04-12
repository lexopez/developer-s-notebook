import { useState } from "react";
import { useSelector } from "react-redux";
import { Favicon } from "./Favicon";
import { useUpdateNoteData } from "../hooks/notes/useUpdateNoteData";
import { useNotes } from "../hooks/notes/useNotes";
import { useAddFolder } from "../hooks/folders/useAddFolder";
import { useAddNote } from "../hooks/notes/useAddNote";
import toast from "react-hot-toast";

export const SmartNoteForm = ({ closeModal }) => {
  const { activeCategory, activeNoteId, activeFolderId } = useSelector(
    (state) => state.notes,
  );

  const { notes } = useNotes();
  const { editNoteData, isPending: isUpdatingNoteData } = useUpdateNoteData();
  const { createFolder, isPending: isCreatingFolder } = useAddFolder();
  const { createNote, isPending: isCreatingNote } = useAddNote();

  // Local state for all possible fields
  const [formData, setFormData] = useState({
    folderName: "",
    noteTitle: "",
    label: "", // For Code Snippet label
    code: "", // For Code Snippet body
    name: "", // For Project/Resource name
    url: "", // For Project/Resource link
    text: "", // For General Notes
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const cat = activeCategory === "all" ? "notes" : activeCategory;
    const itemData = {};

    const isEmpty = (val) => !val || !val.trim();

    // Category-based config
    const categoryConfig = {
      "code snippets": {
        required: ["label", "code"],
      },
      "side projects": {
        required: ["name", "url"],
      },
      resources: {
        required: ["name", "url"],
      },
      default: {
        required: ["title", "text"],
      },
    };

    const config = categoryConfig[cat] || categoryConfig.default;

    // Validate required fields
    const hasEmptyField = config.required.some((field) =>
      isEmpty(formData[field]),
    );

    if (hasEmptyField) return;

    // Validate field lengths
    if (formData.label && formData.label.trim().length > 100) return;
    if (formData.code && formData.code.trim().length > 5000) return;
    if (formData.name && formData.name.trim().length > 100) return;
    if (formData.url && formData.url.trim().length > 2000) return;
    if (formData.title && formData.title.trim().length > 100) return;
    if (formData.text && formData.text.trim().length > 5000) return;

    // Assign required fields dynamically
    config.required.forEach((field) => {
      itemData[field] = formData[field];
    });

    // let noteData;
    const activeNote = notes.find((n) => n.id === activeNoteId);

    // Optional fields
    if (
      !activeFolderId &&
      !activeNoteId &&
      !isEmpty(formData.folderName) &&
      formData.folderName.trim().length <= 50
    ) {
      createFolder({
        folderName: formData.folderName,
        noteTitle: formData.noteTitle,
        itemData: { [cat]: [{ ...itemData, id: crypto.randomUUID() }] },
      });
      closeModal?.();
    }

    if (
      !activeNoteId &&
      activeFolderId &&
      !isEmpty(formData.noteTitle) &&
      formData.noteTitle.trim().length <= 50
    ) {
      createNote({
        title: formData.noteTitle,
        folderId: activeFolderId,
        itemData: { [cat]: [{ ...itemData, id: crypto.randomUUID() }] },
      });
      closeModal?.();
    }

    if (activeNoteId) {
      // 1. Create a deep copy of the current data
      const updatedData = {
        ...activeNote.data,
        [cat]: [
          ...(activeNote.data[cat] || []),
          { ...itemData, id: crypto.randomUUID() },
        ],
      };

      editNoteData(
        {
          id: activeNoteId,
          data: updatedData,
        },
        {
          onSuccess: () => {
            toast.success("Note created!");
            closeModal?.();
          },
        },
      );
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <form
        onSubmit={handleFormSubmit}
        className="w-full max-w-4xl space-y-4 animate-in fade-in duration-500 mx-auto"
      >
        <div className="p-2 rounded-3xl bg-white dark:bg-[#0f1115] border border-cyan-100 dark:border-[#0f1115] space-y-2">
          <div className="flex items-center justify-center gap-2 mb-2 p-5">
            <span className="text-xs font-bold uppercase tracking-tighter text-cyan-600">
              {activeCategory === "all" ? "Notes" : activeCategory}
            </span>
          </div>

          {!activeFolderId && !activeNoteId && (
            <>
              <span className="text-[10px] font-light text-slate-400 capitalize tracking-widest mb-2">
                Folder (Optional) {activeNoteId}
              </span>
              <input
                name="folderName"
                placeholder="No Folder Selected - Create a Folder..."
                className="focus:ring-2 focus:ring-cyan-500/20 border border-transparent focus:border-cyan-500/50 w-full p-3 rounded-xl bg-slate-100 dark:text-slate-200 dark:bg-slate-900 outline-none"
                onChange={handleChange}
                maxLength={50}
              />
            </>
          )}
          {!activeNoteId && (
            <>
              <span className="text-[10px] font-light text-slate-400 capitalize tracking-widest mb-2">
                Note Label
              </span>
              <input
                name="noteTitle"
                placeholder="No Note Selected - Give this Note a Label..."
                className="focus:ring-2 focus:ring-cyan-500/20 border border-transparent focus:border-cyan-500/50 w-full p-3 rounded-xl bg-slate-100 dark:text-slate-200 dark:bg-slate-900 outline-none"
                onChange={handleChange}
                maxLength={50}
                required
              />
            </>
          )}

          {/* Step 2: Dynamic Fields based on Category */}
          {activeCategory === "code snippets" && (
            <>
              <span className="text-[10px] font-light text-slate-400 capitalize tracking-widest mb-2">
                Code Snippet Name
              </span>
              <input
                name="label"
                placeholder="Snippet Name (e.g. Tailwind Config)"
                className="focus:ring-2 focus:ring-cyan-500/20 border border-transparent focus:border-cyan-500/50 w-full p-3 rounded-xl bg-slate-100 dark:text-slate-200 dark:bg-slate-900 outline-none"
                onChange={handleChange}
                maxLength={100}
                required
              />
              <span className="text-[10px] font-light text-slate-400 capitalize tracking-widest mb-2">
                Code
              </span>
              <textarea
                name="code"
                placeholder="Paste your code here..."
                className="focus:ring-2 focus:ring-cyan-500/20 border border-transparent focus:border-cyan-500/50 w-full h-48 p-4 rounded-xl bg-slate-100 dark:text-slate-200 dark:bg-slate-900 font-mono text-sm outline-none resize-none no-scrollbar"
                onChange={handleChange}
                required
              />
            </>
          )}

          {(activeCategory === "side projects" ||
            activeCategory === "resources") && (
            <>
              <span className="text-[10px] font-light text-slate-400 capitalize tracking-widest mb-2">
                {activeCategory === "side projects"
                  ? "Project Name"
                  : "Resource Name"}
              </span>
              <input
                name="name"
                placeholder="Name..."
                className="focus:ring-2 focus:ring-cyan-500/20 border border-transparent focus:border-cyan-500/50 w-full p-3 rounded-xl bg-slate-100 dark:text-slate-200 dark:bg-slate-900 outline-none"
                onChange={handleChange}
                maxLength={100}
                required
              />
              <span className="text-[10px] font-light text-slate-400 capitalize tracking-widest mb-2">
                URL
              </span>
              <input
                name="url"
                placeholder="URL (https://...)"
                className="focus:ring-2 focus:ring-cyan-500/20 border border-transparent focus:border-cyan-500/50 w-full p-3 rounded-xl bg-slate-100 dark:text-slate-200 dark:bg-slate-900 outline-none"
                onChange={handleChange}
                required
              />
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800">
                <Favicon url={formData.url} />
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {formData.name ||
                      `${activeCategory === "side projects" ? "Project" : activeCategory === "resources" ? "Resource" : ""} Preview`}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                    {formData.url || "Enter a URL above..."}
                  </p>
                </div>
              </div>
            </>
          )}

          {(activeCategory === "notes" || activeCategory === "all") && (
            <>
              <span className="text-[10px] font-light text-slate-400 capitalize tracking-widest mb-2">
                Note Title
              </span>
              <input
                name="title" // New Field
                placeholder="Note Title (e.g., Thoughts on Refactoring)"
                className="focus:ring-2 focus:ring-cyan-500/20 border border-transparent focus:border-cyan-500/50 w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-900 outline-none dark:text-slate-200"
                onChange={handleChange}
                maxLength={100}
                required
              />
              <span className="text-[10px] font-light text-slate-400 capitalize tracking-widest mb-2">
                Note Body
              </span>
              <textarea
                name="text"
                placeholder="Write your thoughts..."
                className="focus:ring-2 focus:ring-cyan-500/20 border border-transparent focus:border-cyan-500/50 w-full h-48 p-4 rounded-xl bg-slate-100 dark:text-slate-200 dark:bg-slate-900 outline-none resize-none no-scrollbar"
                onChange={handleChange}
                required
              />
            </>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-4 mb-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl transition-all transform active:scale-[0.98] cursor-pointer"
          disabled={isCreatingNote || isCreatingFolder || isUpdatingNoteData}
        >
          {isCreatingNote || isCreatingFolder || isUpdatingNoteData ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin m-auto" />
          ) : (
            "Create"
          )}
        </button>
      </form>
    </div>
  );
};
