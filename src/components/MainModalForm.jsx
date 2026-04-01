import { X } from "lucide-react";

export default function MainModalForm({ children, setIsModalOpen }) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 ">
      <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-3xl p-8 relative dark:border-slate-200">
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}
