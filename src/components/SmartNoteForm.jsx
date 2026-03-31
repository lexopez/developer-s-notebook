import { useState } from "react";
import { useDispatch } from "react-redux";
import { addContentToNote } from "../store/notesSlice";
import { Favicon } from "./Favicon";

export const SmartNoteForm = ({
  activeCategory,
  activeNoteId,
  activeFolderId,
  onSuccess,
}) => {
  const dispatch = useDispatch();

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

    const cat = activeCategory === "all" ? "notes" : activeCategory;
    const itemData = {};

    const isEmpty = (val) => !val || !val.trim();

    // Optional fields
    if (
      !activeFolderId &&
      !isEmpty(formData.folderName) &&
      formData.folderName.trim().length <= 50
    ) {
      itemData.folderName = formData.folderName;
    }

    if (
      !activeNoteId &&
      !isEmpty(formData.noteTitle) &&
      formData.noteTitle.trim().length <= 50
    ) {
      itemData.noteTitle = formData.noteTitle;
    }

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

    // Dispatch
    dispatch(
      addContentToNote({
        data: itemData,
      }),
    );

    onSuccess?.();
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
              maxLength={50}
              required
            />
          )}
          {!activeNoteId && (
            <input
              name="noteTitle"
              placeholder="No Note Selected - Give this Note a Label..."
              className="w-full p-3 rounded-xl bg-white dark:text-slate-200 dark:bg-slate-900 outline-none"
              onChange={handleChange}
              maxLength={50}
              required
            />
          )}

          {/* Step 2: Dynamic Fields based on Category */}
          {activeCategory === "code snippets" && (
            <>
              <input
                name="label"
                placeholder="Snippet Name (e.g. Tailwind Config)"
                className="w-full p-3 rounded-xl bg-white dark:text-slate-200 dark:bg-slate-900 outline-none"
                onChange={handleChange}
                maxLength={100}
                required
              />
              <textarea
                name="code"
                placeholder="Paste your code here..."
                className="w-full h-48 p-4 rounded-xl bg-white dark:text-slate-200 dark:bg-slate-900 font-mono text-sm outline-none resize-none no-scrollbar"
                onChange={handleChange}
                required
              />
            </>
          )}

          {(activeCategory === "side projects" ||
            activeCategory === "resources") && (
            <>
              <input
                name="name"
                placeholder="Name..."
                className="w-full p-3 rounded-xl bg-white dark:text-slate-200 dark:bg-slate-900 outline-none"
                onChange={handleChange}
                maxLength={100}
                required
              />
              <input
                name="url"
                placeholder="URL (https://...)"
                className="w-full p-3 rounded-xl bg-white dark:text-slate-200 dark:bg-slate-900 outline-none"
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
              <input
                name="title" // New Field
                placeholder="Note Title (e.g., Thoughts on Refactoring)"
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 outline-none dark:text-slate-200"
                onChange={handleChange}
                maxLength={100}
                required
              />
              <textarea
                name="text"
                placeholder="Write your thoughts..."
                className="w-full h-48 p-4 rounded-xl bg-white dark:text-slate-200 dark:bg-slate-900 outline-none resize-none no-scrollbar"
                onChange={handleChange}
                required
              />
            </>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl transition-all transform active:scale-[0.98] cursor-pointer"
        >
          Create a Note
        </button>
      </form>
    </div>
  );
};
