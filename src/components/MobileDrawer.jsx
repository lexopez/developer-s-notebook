export default function MobileDrawer({ isOpen, onClose, title, children }) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0f1115] rounded-t-[2.5rem] z-[101] p-6 transition-transform duration-300 transform ${isOpen ? "translate-y-0" : "translate-y-full"} max-h-[80vh] overflow-y-auto`}
      >
        <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-6" />
        <h2 className="text-xl font-bold mb-6 dark:text-white text-center">
          {title}
        </h2>
        {children}
      </div>
    </>
  );
}
