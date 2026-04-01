import { Edit3 } from "lucide-react";

export default function EditButton({ editItem }) {
  return (
    <button
      onClick={() => {
        editItem();
      }}
      className="p-1 lg:hover:text-cyan-500 lg:text-slate-400 text-cyan-400 cursor-pointer"
    >
      <Edit3 size={14} />
    </button>
  );
}
