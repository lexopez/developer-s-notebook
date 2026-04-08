import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/notesSlice";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

export default function MobileHeader() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.notes.theme);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <h1 className="font-bold text-slate-800 dark:text-white">DevNotebook</h1>
      <button
        onClick={() => dispatch(toggleTheme())}
        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg"
      >
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>
    </div>
  );
}
