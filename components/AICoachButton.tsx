"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { AICoachModal } from "./AICoachModal";
import { isPremiumActive } from "@/lib/premium";

export function AICoachButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const handleClick = () => {
    // Check premium status when opening
    setIsPremium(isPremiumActive());
    setIsModalOpen(true);
  };

  return (
    <>
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="fixed bottom-4 left-4 px-5 py-2.5 rounded-full z-10 text-sm md:text-base
                   bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium
                   shadow-md hover:shadow-lg transition-shadow duration-200
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        aria-label="Open AI Breathing Coach"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          AI Coach
        </span>
      </motion.button>

      <AICoachModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isPremium={isPremium}
      />
    </>
  );
}
