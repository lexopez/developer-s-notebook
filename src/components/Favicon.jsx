import { useState } from "react";
import { getDomain } from "../helpers/getDomain";
import { Globe } from "lucide-react";

export const Favicon = ({ url, size = 32 }) => {
  const domain = getDomain(url);
  const [error, setError] = useState(false);

  // If no domain or error, show a default "Globe" icon
  if (!domain || error) {
    return (
      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
        <Globe size={20} />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm border border-slate-100 dark:border-slate-800">
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=${size * 2}`}
        alt="favicon"
        className="w-full h-full object-contain p-1.5"
        onError={() => setError(true)}
      />
    </div>
  );
};
