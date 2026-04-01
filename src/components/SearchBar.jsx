import { Search, XCircle } from "lucide-react";

export default function SearchBar({
  activeCategory,
  searchQuery,
  setSearchQuery,
}) {
  return (
    <div className="max-w-6xl mx-auto mb-8 animate-in fade-in slide-in-from-top-2">
      <div className="relative group">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors"
        />
        <input
          type="text"
          placeholder={`Search in ${activeCategory}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:text-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/5 transition-all text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
          >
            <XCircle size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
