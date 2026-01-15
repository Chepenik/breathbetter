"use client";

import { useState } from "react";
import TipButton from "./TipButton";
import { motion } from "framer-motion";

export function SupportButton() {
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsTipModalOpen(true)}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-4 right-4 px-5 py-2.5 rounded-full z-10 text-sm md:text-base
                   bg-gradient-to-r from-pink-500 to-violet-500 text-white font-medium
                   shadow-md hover:shadow-lg transition-shadow duration-200
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
        aria-label="Support this project"
      >
        <span className="flex items-center gap-2">
          Support
          <span aria-hidden="true">❤️</span>
        </span>
      </motion.button>

      <TipButton
        isOpen={isTipModalOpen}
        onClose={() => setIsTipModalOpen(false)}
      />
    </>
  );
} 