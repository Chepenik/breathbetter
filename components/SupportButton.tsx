"use client";

import { useState } from "react";
import TipButton from "./TipButton";

export function SupportButton() {
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsTipModalOpen(true)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-white/10 text-white rounded-lg
                 hover:bg-white/20 transition-all duration-300 border border-white/10"
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