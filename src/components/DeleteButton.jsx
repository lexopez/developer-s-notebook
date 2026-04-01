import { Check, X, Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteButton({ handleDelete }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <>
      {showDeleteConfirm ? (
        <div className="flex items-center gap-1 bg-red-500 rounded-lg p-1 animate-in slide-in-from-right-2">
          <button
            onClick={(e) => {
              e.stopPropagation();

              handleDelete();
              setShowDeleteConfirm(false);
            }}
            className="p-1 text-white hover:bg-white/20 rounded cursor-pointer"
          >
            <Check size={12} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteConfirm(false);
            }}
            className="p-1 text-white hover:bg-white/20 rounded cursor-pointer"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDeleteConfirm(true);
          }}
          className="p-2 bg-slate-100 dark:bg-slate-800 lg:text-slate-400 text-red-500 lg:hover:text-red-500 rounded-xl transition-colors cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      )}
    </>
  );
}
