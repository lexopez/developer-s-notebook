import { useEffect, useState } from "react";
import Prism from "prismjs";
import { Copy, Check } from "lucide-react"; // Added Check icon for feedback
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-css";
import "prismjs/components/prism-jsx";

export const CodeBlock = ({ code, language = "javascript" }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  return (
    <div className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-[#1d1f21] animate-in fade-in zoom-in-95 duration-300">
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#282a2e] border-b border-slate-800">
        <div className="flex gap-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Code Snippets
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* THE NEW COPY BUTTON */}
          <button
            onClick={handleCopy}
            className={`cursor-pointer flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200 ${
              copied
                ? "text-green-400 bg-green-400/10"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            <span className="text-[10px] font-bold uppercase tracking-tight">
              {copied ? "Copied" : "Copy"}
            </span>
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="p-0 overflow-hidden relative">
        <pre className="!bg-transparent !m-0 !p-6 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700">
          <code
            className={`language-${language} text-sm font-mono leading-relaxed`}
          >
            {code}
          </code>
        </pre>
      </div>
    </div>
  );
};
