import { X } from "lucide-react";

export default function MainModalForm({ children, setIsModalOpen }) {
  return (
    <>
      <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
        <div className="bg-white dark:bg-slate-800 w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden relative flex flex-col">
          {/* Modal Header */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                Create a New Note
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                }}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-2 overflow-y-auto no-scrollbar flex-1 bg-white dark:bg-[#0f1115]">
            <div className="space-y-6 animate-in fade-in">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
}
