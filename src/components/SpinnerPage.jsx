const SpinnerPage = () => {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Outer Ring */}
      <div className="relative flex items-center justify-center">
        <div className="h-20 w-20 rounded-full border-4 border-slate-200 dark:border-slate-800" />

        {/* Animated Spinner */}
        <div className="absolute h-20 w-20 rounded-full border-4 border-t-cyan-500 border-r-transparent border-b-transparent border-l-transparent animate-spin" />

        {/* Inner Pulse */}
        <div className="absolute h-10 w-10 bg-cyan-500/20 rounded-xl animate-pulse flex items-center justify-center">
          <div className="h-2 w-2 bg-cyan-500 rounded-full animate-ping" />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          Developer<span className="text-cyan-500">Notebook</span>
        </h2>
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500 animate-pulse">
          Data Loading...
        </p>
      </div>
    </div>
  );
};

export default SpinnerPage;
