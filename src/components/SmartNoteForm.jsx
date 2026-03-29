import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addFolder, addNote } from "../store/notesSlice";
import { Plus } from "lucide-react";

export const SmartNoteForm = ({
  activeCategory,
  activeNoteId,
  activeFolderId,
  onSuccess,
}) => {
  const dispatch = useDispatch();
  const { folders } = useSelector((state) => state.notes);

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

  const handleFormSubmit = (e) => {
    e.preventDefault();

    // 1. Logic: If no folder is selected, we must create one first
    let folderId = activeFolderId;
    if (!folderId && formData.folderName.trim()) {
      // In a real app, you'd capture the ID from the dispatch or use a UUID
      dispatch(addFolder(formData.folderName));
    }

    // 2. Logic: If no note is selected, create the note
    let noteId = activeNoteId;
    if (!noteId && formData.noteTitle.trim()) {
      dispatch(addNote(formData.noteTitle));
    }

    // 3. Logic: Add the actual content based on category
    const payload = {
      category: activeCategory === "all" ? "notes" : activeCategory, // Default to notes if on "All"
      data: {},
    };

    if (activeCategory === "code snippets") {
      payload.data = {
        id: Date.now(),
        label: formData.label,
        code: formData.code,
      };
    } else if (
      activeCategory === "side projects" ||
      activeCategory === "resources"
    ) {
      payload.data = { id: Date.now(), name: formData.name, url: formData.url };
    } else {
      payload.data = { id: Date.now(), text: formData.text };
    }

    console.log(payload, noteId, folderId);

    // Dispatch your save action (assuming you have an addContent action)
    // dispatch(addContentToNote({ noteId: noteId, ...payload }));

    if (onSuccess) onSuccess(); // Close modal if applicable
  };

  return (
    <div className="flex flex-col items-center w-full">
      <form
        onSubmit={handleFormSubmit}
        className="w-full max-w-4xl space-y-4 animate-in fade-in duration-500 mx-auto"
      >
        <div className="p-6 rounded-3xl bg-cyan-50/50 dark:bg-cyan-900/10 border border-cyan-100 dark:border-cyan-900/30 space-y-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-tighter text-cyan-600">
              {activeCategory === "all" ? "Notes" : activeCategory}
            </span>
          </div>

          {!activeFolderId && (
            <input
              name="folderName"
              placeholder="No Folder Selected - Create a Folder Name..."
              className="w-full p-3 rounded-xl bg-white dark:text-slate-200 dark:bg-slate-900 outline-none"
              onChange={handleChange}
              required
            />
          )}
          {!activeNoteId && (
            <input
              name="noteTitle"
              placeholder="No Note Selected - Give this Note a Label..."
              className="w-full p-3 rounded-xl bg-white dark:text-slate-200 dark:bg-slate-900 outline-none"
              onChange={handleChange}
              required
            />
          )}

          {/* Step 2: Dynamic Fields based on Category */}
          {activeCategory === "code snippets" && (
            <>
              <input
                name="label"
                placeholder="Snippet Label (e.g. Tailwind Config)"
                className="w-full p-3 rounded-xl bg-white dark:text-slate-200 dark:bg-slate-900 outline-none"
                onChange={handleChange}
              />
              <textarea
                name="code"
                placeholder="Paste your code here..."
                className="w-full h-48 p-4 rounded-xl bg-white dark:text-slate-200 dark:bg-slate-900 font-mono text-sm outline-none resize-none"
                onChange={handleChange}
              />
            </>
          )}

          {(activeCategory === "side projects" ||
            activeCategory === "resources") && (
            <>
              <input
                name="name"
                placeholder="Display Name"
                className="w-full p-3 rounded-xl bg-white dark:text-slate-200 dark:bg-slate-900 outline-none"
                onChange={handleChange}
              />
              <input
                name="url"
                placeholder="URL (https://...)"
                className="w-full p-3 rounded-xl bg-white dark:text-slate-200 dark:bg-slate-900 outline-none"
                onChange={handleChange}
              />
            </>
          )}

          {(activeCategory === "notes" || activeCategory === "all") && (
            <textarea
              name="text"
              placeholder="Write your thoughts..."
              className="w-full h-48 p-4 rounded-xl bg-white dark:text-slate-200 dark:bg-slate-900 outline-none resize-none"
              onChange={handleChange}
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl transition-all transform active:scale-[0.98] cursor-pointer"
        >
          Save to Notebook
        </button>
      </form>
    </div>
  );
};
