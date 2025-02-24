"use client";

import { useState } from "react";
import TipButton from "./TipButton";

export function SupportButton() {
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsTipModalOpen(true)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-slate-200/10 dark:bg-white/10 text-slate-900 dark:text-white rounded-lg
                 hover:bg-slate-200/20 dark:hover:bg-white/20 transition-all duration-300 border border-slate-200/10 dark:border-white/10"
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