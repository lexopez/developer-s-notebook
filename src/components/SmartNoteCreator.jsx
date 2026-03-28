import { useState } from "react";

export const SmartNoteCreator = ({ activeCategory, folders, dispatch }) => {
  const [formData, setFormData] = useState({
    folderName: "",
    noteTitle: "",
    contentLabel: "", // for code label
    contentValue: "", // for code, link, or note text
    url: "", // for projects/resources
  });

  const handleSubmit = () => {
    // 1. If no folder exists, dispatch addFolder(formData.folderName)
    // 2. Dispatch addNote(formData.noteTitle)
    // 3. Dispatch addContentToNote({ category: activeCategory, data: ... })
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 animate-in fade-in zoom-in-95">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">
        Create New {activeCategory}
      </h2>

      <div className="space-y-4">
        {/* FOLDER & NOTE TITLES (Only if none selected) */}
        {!folders.length && (
          <input
            placeholder="New Folder Name..."
            className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none border-2 border-transparent focus:border-cyan-500"
            onChange={(e) =>
              setFormData({ ...formData, folderName: e.target.value })
            }
          />
        )}

        <input
          placeholder="Note Title (e.g., React Basics)..."
          className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 outline-none border-2 border-transparent focus:border-cyan-500"
          onChange={(e) =>
            setFormData({ ...formData, noteTitle: e.target.value })
          }
        />

        <hr className="border-slate-200 dark:border-slate-800 my-4" />

        {/* DYNAMIC FIELDS BASED ON CATEGORY */}
        {activeCategory === "code snippets" && (
          <>
            <input
              placeholder="Label (e.g., UseFetch Hook)"
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800"
            />
            <textarea
              placeholder="Paste code here..."
              className="w-full h-40 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 font-mono text-sm"
            />
          </>
        )}

        {(activeCategory === "side projects" ||
          activeCategory === "resources") && (
          <>
            <input
              placeholder="Name"
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800"
            />
            <input
              placeholder="URL (https://...)"
              className="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800"
            />
          </>
        )}

        {activeCategory === "notes" && (
          <textarea
            placeholder="Write your note..."
            className="w-full h-40 p-3 rounded-xl bg-slate-100 dark:bg-slate-800"
          />
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-cyan-500/20"
        >
          Create Entry
        </button>
      </div>
    </div>
  );
};
