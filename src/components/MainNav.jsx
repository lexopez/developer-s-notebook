import { useDispatch, useSelector } from "react-redux";
import { setCategory, toggleTheme } from "../store/newStore";
import {
  BookOpen,
  Code,
  Hash,
  Rocket,
  StickyNote,
  Moon,
  Sun,
} from "lucide-react";

export default function MainNav() {
  const { activeCategory, theme } = useSelector((state) => state.notes);
  const dispatch = useDispatch();

  const categories = [
    { id: "all", label: "All", icon: <Hash size={16} /> },
    { id: "code snippets", label: "Code Snippets", icon: <Code size={16} /> },
    { id: "side projects", label: "Side Projects", icon: <Rocket size={16} /> },
    { id: "resources", label: "Resources", icon: <BookOpen size={16} /> },
    { id: "notes", label: "Just Notes", icon: <StickyNote size={16} /> },
  ];

  return (
    <nav className="flex items-center justify-center lg:justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
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
      <button
        onClick={() => dispatch(toggleTheme())}
        className="hidden lg:flex p-2 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform cursor-pointer"
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </nav>
  );
}
