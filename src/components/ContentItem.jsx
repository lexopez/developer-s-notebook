// import { CopyIcon, Rocket } from "lucide-react";
// import { useEffect, useState } from "react";

// export const ContentItem = ({ item, category }) => {
//   const [copied, setCopied] = useState(false);
//   const handleCopy = (text) => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     // You could add a "Copied!" toast here
//     // toast.success("Code snippet copied to clipboard!");
//   };

//   // Reset the icon state after 1.5 seconds
//   useEffect(() => {
//     if (copied) {
//       const timeout = setTimeout(() => setCopied(false), 1500);
//       return () => clearTimeout(timeout);
//     }
//   }, [copied]);

//   return (
//     <div className="group p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
//       {category === "code snippets" && (
//         <div className="space-y-3">
//           <div className="flex justify-between items-center">
//             <span className="text-sm font-semibold text-cyan-600">
//               {item.label}
//             </span>
//             <button
//               onClick={() => handleCopy(item.code)}
//               className="p-1.5 text-slate-400 hover:text-cyan-500 rounded-md hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer"
//             >
//               {/* <CopyIcon size={14} /> */}
//               <CopyIcon
//                 size={14}
//                 fill={copied ? "cyan" : "none"}
//                 className="transition-transform duration-200"
//               />
//             </button>
//           </div>
//           <pre className="text-xs font-mono bg-slate-100 dark:bg-slate-900 p-4 rounded-xl overflow-x-auto text-slate-700 dark:text-slate-300">
//             {item.code}
//           </pre>
//         </div>
//       )}

//       {(category === "side projects" || category === "resources") && (
//         <div className="flex justify-between items-center">
//           <span className="font-medium text-slate-800 dark:text-slate-200">
//             {item.name}
//           </span>
//           <a
//             href={item.url}
//             target="_blank"
//             rel="noreferrer"
//             className="text-xs text-cyan-500 hover:underline flex items-center gap-1"
//           >
//             Visit Link <Rocket size={12} />
//           </a>
//         </div>
//       )}

//       {category === "notes" && (
//         <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
//           "{item.text}"
//         </p>
//       )}
//     </div>
//   );
// };

import { CopyIcon, Rocket, Maximize2, X } from "lucide-react";
import { useEffect, useState } from "react";

export const ContentItem = ({ item, category }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = (e, text) => {
    e.stopPropagation(); // Prevent opening the modal when clicking copy
    navigator.clipboard.writeText(text);
    setCopied(true);
  };

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 1500);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  // Determine if this category is "Expandable"
  const isExpandable = category === "code snippets" || category === "notes";

  return (
    <>
      {/* GRID CARD 
        Using h-32 (or any fixed height) to ensure all cards are the same size.
      */}
      <div
        onClick={() => isExpandable && setIsExpanded(true)}
        className={`group relative p-5 h-32 flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all hover:border-cyan-500/50 hover:shadow-lg ${isExpandable ? "cursor-pointer" : "cursor-default"}`}
      >
        <div className="flex justify-between items-start gap-2">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2">
            {category === "code snippets"
              ? item.label
              : category === "notes"
                ? item.title
                : item.name}
          </span>

          {isExpandable && (
            <Maximize2
              size={14}
              className="text-slate-400 group-hover:text-cyan-500 transition-colors shrink-0"
            />
          )}
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
              className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all"
            >
              <Rocket size={14} />
            </a>
          )}
        </div>
      </div>

      {/* EXPANDED MODAL */}
      {isExpanded && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 w-full max-w-3xl max-h-[80vh] rounded-3xl overflow-hidden relative flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-600 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-1">
                  {category}
                </p>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {category === "code snippets" ? item.label : item.title}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {category === "code snippets" && (
                  <button
                    onClick={(e) => handleCopy(e, item.code)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-500 transition-all cursor-pointer"
                  >
                    <CopyIcon
                      size={16}
                      fill={copied ? "currentColor" : "none"}
                    />
                    <span className="text-xs font-bold">
                      {copied ? "Copied!" : "Copy Code"}
                    </span>
                  </button>
                )}
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto no-scrollbar">
              {category === "code snippets" ? (
                <pre className="text-sm font-mono bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 overflow-x-auto">
                  {item.code}
                </pre>
              ) : (
                <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {item.text}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
