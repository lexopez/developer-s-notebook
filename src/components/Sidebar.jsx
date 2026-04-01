import { Plus, X, MoreVertical, Edit3, Trash2 } from "lucide-react";
import { useState } from "react";

export const SidebarList = ({
  title,
  items,
  activeId,
  onSelect,
  onAdd,
  onRename,
  onDelete,
  Icon,
  placeholder,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [menuConfig, setMenuConfig] = useState(null);

  const handleAdd = (e) => {
    if (e.key === "Enter" && newValue.trim()) {
      onAdd(newValue);
      setNewValue("");
      setIsAdding(false);
    }
  };

  const handleRename = (id, e) => {
    if (e.key === "Enter" && editValue.trim()) {
      onRename(id, editValue);
      setEditingId(null);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
            {title}
          </h3>
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="text-slate-400 hover:text-cyan-500 cursor-pointer"
          >
            {isAdding ? <X size={20} /> : <Plus size={20} />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-1">
          {isAdding && (
            <input
              autoFocus
              className="w-full bg-slate-200 dark:text-slate-200 dark:bg-slate-800/50 text-sm p-2 rounded-lg outline-none border-b-2 border-cyan-500 mb-2"
              placeholder={placeholder}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              onKeyDown={handleAdd}
              onBlur={() => setIsAdding(false)}
            />
          )}

          {items.map((item) => (
            <div key={item.id} className="group relative">
              {editingId === item.id ? (
                <input
                  autoFocus
                  className="w-full bg-white dark:text-slate-200 dark:bg-slate-800 border border-cyan-500 rounded-xl p-3 text-sm outline-none"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => handleRename(item.id, e)}
                  onBlur={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center">
                  <button
                    onClick={() => onSelect(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      activeId === item.id
                        ? "bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 font-semibold"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon size={20} className="shrink-0" />
                    <span className="text-sm truncate pr-4">
                      {item.title || item.name}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setMenuConfig({
                        id: item.id,
                        x: rect.left - 100,
                        y: rect.top,
                        value: item.title || item.name,
                      });
                    }}
                    className="absolute right-2 p-1.5 opacity-0 group-hover:opacity-100 text-slate-400 cursor-pointer"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Localized Context Menu */}
        {menuConfig && (
          <>
            <div
              className="fixed inset-0 z-50"
              onClick={() => setMenuConfig(null)}
            />
            <div
              style={{ top: menuConfig.y, left: menuConfig.x }}
              className="fixed w-32 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-[60] py-1 animate-in fade-in zoom-in-95 duration-100"
            >
              <button
                onClick={() => {
                  setEditingId(menuConfig.id);
                  setEditValue(menuConfig.value);
                  setMenuConfig(null);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Edit3 size={14} /> Rename
              </button>
              <button
                onClick={() => {
                  onDelete(menuConfig.id);
                  setMenuConfig(null);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
