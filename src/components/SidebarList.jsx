import { Plus, X } from "lucide-react";
import { useState } from "react";
import DeleteButton from "./DeleteButton";
import EditButton from "./EditButton";

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

  const handleAdd = (e) => {
    if (e.key === "Enter" && newValue.trim() && newValue.length <= 50) {
      onAdd(newValue);
      setNewValue("");
      setIsAdding(false);
    }
  };

  const handleRename = (id, e) => {
    if (e.key === "Enter" && editValue.trim() && editValue.length <= 50) {
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

        <div className="flex-1 overflow-y-auto no-scrollbar space-y-1 h-full">
          {isAdding && (
            <>
              <input
                autoFocus
                maxLength={50}
                className="w-full bg-slate-200 dark:text-slate-200 dark:bg-slate-800/50 text-sm p-2 rounded-lg outline-none border-b-2 border-cyan-500 mb-2"
                placeholder={placeholder}
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                onKeyDown={handleAdd}
                onBlur={() => setIsAdding(false)}
              />
              {newValue.length >= 40 && (
                <p className="text-[9px] text-orange-500 mt-1 px-1">
                  {50 - newValue.length} characters remaining
                </p>
              )}
            </>
          )}

          {items.map((item) => (
            <div key={item.id} className="group relative">
              {editingId === item.id ? (
                <>
                  <input
                    autoFocus
                    maxLength={50}
                    className="w-full bg-white dark:text-slate-200 dark:bg-slate-800 border border-cyan-500 rounded-xl p-3 text-sm outline-none"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => handleRename(item.id, e)}
                    onBlur={() => setEditingId(null)}
                  />
                  {editValue.length >= 40 && (
                    <p className="text-[9px] text-orange-500 mt-1 px-1">
                      {50 - editValue.length} characters remaining
                    </p>
                  )}
                </>
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
                    <span className="text-sm truncate pr-4 capitalize">
                      {item.title || item.name}
                    </span>
                  </button>
                  <div className="absolute right-2 flex gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity lg:bg-slate-50/80 lg:dark:bg-slate-950/80 backdrop-blur-sm p-1 rounded-lg">
                    <EditButton
                      editItem={() => {
                        setEditingId(item.id);
                        setEditValue(item.title || item.name);
                      }}
                    />
                    <DeleteButton handleDelete={() => onDelete(item.id)} />
                  </div>
                </div>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <p className="text-slate-400 text-sm font-medium text-center mt-4">
              No {title} yet. Click the plus button to add one!
            </p>
          )}
        </div>
      </div>
    </>
  );
};
