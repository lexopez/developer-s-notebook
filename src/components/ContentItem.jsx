import { Maximize2, X, Edit3, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux"; // Assuming you have delete/update actions
import { deleteContent, updateContent } from "../store/notesSlice";
import { CodeBlock } from "./CodeBlock";
import { Favicon } from "./Favicon";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

export const ContentItem = ({ item, category }) => {
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Edit State
  const [editMode, setEditMode] = useState("view"); // "view" or "edit"
  const [tempData, setTempData] = useState({ ...item });

  const [isEditingSimple, setIsEditingSimple] = useState(false);

  const handleDelete = () => {
    dispatch(deleteContent({ id: item.id, category }));
  };

  const handleSaveEdit = () => {
    const isEmpty = (val) => !val || !val.toString().trim();

    if (!tempData || typeof tempData !== "object") return;

    // Category-based required fields
    const categoryConfig = {
      "code snippets": ["label", "code"],
      "side projects": ["name", "url"],
      resources: ["name", "url"],
      default: ["title", "text"],
    };

    const requiredFields = categoryConfig[category] || categoryConfig.default;

    // Check for missing/empty fields
    const hasInvalidField = requiredFields.some((field) =>
      isEmpty(tempData[field]),
    );

    // Check for field length violations
    if (tempData.label && tempData.label.trim().length > 100) return;
    if (tempData.code && tempData.code.trim().length > 5000) return;
    if (tempData.name && tempData.name.trim().length > 100) return;
    if (tempData.url && tempData.url.trim().length > 2000) return;
    if (tempData.title && tempData.title.trim().length > 100) return;
    if (tempData.text && tempData.text.trim().length > 5000) return;

    if (hasInvalidField) {
      console.warn("Validation failed:", tempData);
      return;
    }

    dispatch(
      updateContent({
        id: item.id,
        category,
        newData: tempData,
      }),
    );

    setEditMode("view");
    setIsEditingSimple(false);
  };

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  const isExpandable = category === "code snippets" || category === "notes";

  return (
    <>
      {/* GRID CARD */}
      <div
        onClick={() => isExpandable && setIsExpanded(true)}
        className={`group relative p-5 h-32 flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all hover:border-cyan-500/50 hover:shadow-lg ${category !== "side projects" && category !== "resources" ? "cursor-pointer" : ""}`}
      >
        {/* Action Overlay for Grid Card */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          <EditButton
            editItem={() => {
              if (isExpandable) {
                setIsExpanded(true);
                setEditMode("edit");
              } else {
                setIsEditingSimple(true);
              }
            }}
          />
          <DeleteButton handleDelete={handleDelete} />
        </div>

        <div className="flex justify-between items-start gap-2">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2 pr-6 capitalize">
            {category === "code snippets"
              ? item.label
              : category === "notes"
                ? item.title
                : item.name}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {category}
          </span>
          {(category === "side projects" || category === "resources") && (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="hover:bg-slate-200 rounded-lg transition-colors p-1"
            >
              {/* <Rocket size={14} /> */}
              <Favicon url={item.url} />
            </a>
          )}
          {isExpandable && (
            <Maximize2
              size={12}
              className="lg:text-slate-300 text-cyan-500 lg:group-hover:text-cyan-500"
            />
          )}
        </div>
      </div>

      {isEditingSimple && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden relative flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  Update Details
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    handleSaveEdit();
                  }}
                  className="shrink-0 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Save
                </button>
                <DeleteButton handleDelete={handleDelete} />
                <button
                  onClick={() => {
                    setIsEditingSimple(false);
                  }}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-2 overflow-y-auto no-scrollbar flex-1 bg-white dark:bg-[#0f1115]">
              <div className="space-y-6 animate-in fade-in">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800">
                  <Favicon url={tempData.url} />
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {tempData.name || "Project Preview"}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                      {tempData.url || "Enter a URL below..."}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Title / Label
                  </label>
                  <input
                    className="w-full p-4 bg-slate-100 dark:text-slate-200 dark:bg-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/20 border border-transparent focus:border-cyan-500/50"
                    placeholder="e.g. Portfolio Website"
                    value={tempData.name}
                    onChange={(e) =>
                      setTempData({ ...tempData, name: e.target.value })
                    }
                    maxLength={100}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    URL / Destination
                  </label>
                  <input
                    className="w-full p-4 bg-slate-100 dark:text-slate-200 dark:bg-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/20 border border-transparent focus:border-cyan-500/50"
                    placeholder="https://..."
                    value={tempData.url}
                    onChange={(e) =>
                      setTempData({ ...tempData, url: e.target.value })
                    }
                    maxLength={2000}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EXPANDED MODAL */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden relative flex flex-col">
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex gap-1 bg-slate-200/50 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setEditMode("view")}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-all ${editMode === "view" ? "bg-white dark:bg-slate-700 shadow-sm text-cyan-600 cursor-pointer" : "text-slate-500 hover:text-slate-700 cursor-pointer"}`}
                >
                  <Eye size={14} /> View
                </button>
                <button
                  onClick={() => setEditMode("edit")}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold transition-all ${editMode === "edit" ? "bg-white dark:bg-slate-700 shadow-sm text-cyan-600 cursor-pointer" : "text-slate-500 hover:text-slate-700 cursor-pointer"}`}
                >
                  <Edit3 size={14} /> Edit
                </button>
                <DeleteButton handleDelete={handleDelete} />
              </div>

              <div className="flex items-center gap-2">
                {editMode === "edit" && (
                  <button
                    onClick={handleSaveEdit}
                    className="shrink-0 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Save
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    setEditMode("view");
                  }}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-2 overflow-y-auto no-scrollbar flex-1 bg-white dark:bg-[#0f1115] ">
              {editMode === "view" ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ">
                  <div className="flex flex-col gap-6">
                    {category === "code snippets" ? (
                      <>
                        <div className="space-y-1">
                          <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                            {tempData.label}
                          </h2>
                        </div>

                        {/* NEW ENHANCED CODE BLOCK */}
                        <CodeBlock code={tempData.code} language="javascript" />
                      </>
                    ) : (
                      /* Notes Style remains consistent but clean */
                      <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-100">
                          {tempData.title}
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap font-light">
                          {tempData.text}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* EDIT MODE */
                <div className="space-y-6 animate-in fade-in">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Title / Label
                    </label>
                    <input
                      className="w-full p-4 bg-slate-100 dark:text-slate-200 dark:bg-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/20 border border-transparent focus:border-cyan-500/50"
                      value={
                        category === "code snippets"
                          ? tempData.label
                          : tempData.title
                      }
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          [category === "code snippets" ? "label" : "title"]:
                            e.target.value,
                        })
                      }
                      maxLength={100}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      {category === "code snippets" ? "Source Code" : "Content"}
                    </label>
                    <textarea
                      className="w-full h-120 p-4 bg-slate-100 dark:text-slate-200 dark:bg-slate-900 rounded-2xl outline-none focus:ring-2 focus:ring-cyan-500/20 border border-transparent focus:border-cyan-500/50 font-mono text-sm no-scrollbar resize-none"
                      value={
                        category === "code snippets"
                          ? tempData.code
                          : tempData.text
                      }
                      onChange={(e) =>
                        setTempData({
                          ...tempData,
                          [category === "code snippets" ? "code" : "text"]:
                            e.target.value,
                        })
                      }
                      maxLength={5000}
                      required
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
