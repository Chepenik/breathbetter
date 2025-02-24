import { Twitter, Github } from "lucide-react";

export function SocialLinks() {
  return (
    <div className="fixed bottom-4 left-4 flex items-center gap-2">
      <a
        href="https://x.com/conorchepenik"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-slate-200/10 dark:bg-white/10 text-slate-900 dark:text-white
                 hover:bg-slate-200/20 dark:hover:bg-white/20 transition-all duration-300 
                 border border-slate-200/10 dark:border-white/10"
        aria-label="Follow on X (Twitter)"
      >
        <Twitter className="w-4 h-4" />
      </a>
      <a
        href="https://github.com/Chepenik/breathbetter"
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-slate-200/10 dark:bg-white/10 text-slate-900 dark:text-white
                 hover:bg-slate-200/20 dark:hover:bg-white/20 transition-all duration-300 
                 border border-slate-200/10 dark:border-white/10"
        aria-label="View on GitHub"
      >
        <Github className="w-4 h-4" />
      </a>
    </div>
  );
} 