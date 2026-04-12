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
  LogOut,
  Loader2,
  UserIcon,
} from "lucide-react";
import { useLogout, useUser } from "../hooks/user/useAuth";

export default function MainNav() {
  const { activeCategory, theme } = useSelector((state) => state.notes);
  const dispatch = useDispatch();
  const { user } = useUser();
  const { logout, isPending } = useLogout();

  // Extract profile info from metadata
  const avatar = user?.user_metadata?.avatar_url;
  const fullName = user?.email;

  const categories = [
    { id: "all", label: "All", icon: <Hash size={16} /> },
    { id: "code snippets", label: "Code Snippets", icon: <Code size={16} /> },
    { id: "side projects", label: "Side Projects", icon: <Rocket size={16} /> },
    { id: "resources", label: "Resources", icon: <BookOpen size={16} /> },
    { id: "notes", label: "Just Notes", icon: <StickyNote size={16} /> },
  ];

  return (
    <nav className="flex items-center justify-center lg:justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex gap-2 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent ">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => dispatch(setCategory(cat.id))}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              activeCategory === cat.id
                ? "bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-slate-200"
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 py-5 pl-2">
        <button
          onClick={() => dispatch(toggleTheme())}
          className="hidden lg:flex p-2 rounded-full bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 hover:scale-110 transition-transform cursor-pointer"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
        {/* User Profile Section */}
        <div className="flex items-center gap-2 pr-2 border-r border-slate-500">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {fullName.slice(0, 3) + "...@gmail.com"}
            </p>
          </div>

          <div className="h-10 w-10 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex items-center justify-center">
            {avatar ? (
              <img
                src={avatar}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon className="text-slate-500" size={20} />
            )}
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          disabled={isPending}
          className="cursor-pointer flex items-center gap-2 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-slate-200 rounded-lg transition-all disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <LogOut size={18} />
          )}{" "}
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
}
