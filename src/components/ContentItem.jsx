import { Hash, Rocket } from "lucide-react";

export const ContentItem = ({ item, category }) => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a "Copied!" toast here
  };

  return (
    <div className="group p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-md">
      {category === "code snippets" && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-cyan-600">
              {item.label}
            </span>
            <button
              onClick={() => handleCopy(item.code)}
              className="p-1.5 text-slate-400 hover:text-cyan-500 rounded-md hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              <Hash size={14} />
            </button>
          </div>
          <pre className="text-xs font-mono bg-slate-100 dark:bg-slate-900 p-4 rounded-xl overflow-x-auto text-slate-700 dark:text-slate-300">
            {item.code}
          </pre>
        </div>
      )}

      {(category === "side projects" || category === "resources") && (
        <div className="flex justify-between items-center">
          <span className="font-medium text-slate-800 dark:text-slate-200">
            {item.name}
          </span>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-cyan-500 hover:underline flex items-center gap-1"
          >
            Visit Link <Rocket size={12} />
          </a>
        </div>
      )}

      {category === "notes" && (
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
          "{item.text}"
        </p>
      )}
    </div>
  );
};
