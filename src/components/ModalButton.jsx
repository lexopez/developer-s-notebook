import { Plus } from "lucide-react";

export default function ModalButton({ setIsModalOpen }) {
  return (
    <button
      onClick={() => setIsModalOpen(true)}
      className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
    >
      <Plus size={18} /> Add Note
    </button>
  );
}
