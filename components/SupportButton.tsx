"use client";

import { useState } from "react";
import TipButton from "./TipButton";

export function SupportButton() {
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsTipModalOpen(true)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-slate-200/80 dark:bg-white/10 text-slate-800 dark:text-white rounded-lg
                 hover:bg-slate-300/80 dark:hover:bg-white/20 transition-all duration-300 border border-slate-300/50 dark:border-white/10
                 z-10 text-sm md:text-base shadow-sm"
      >
        Support ❤️
      </button>

      <TipButton 
        isOpen={isTipModalOpen}
        onClose={() => setIsTipModalOpen(false)}
      />
    </>
  );
} 