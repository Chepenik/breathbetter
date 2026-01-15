"use client";

import { patterns, type Pattern } from "@/lib/patterns";
import { useState } from "react";
import { motion } from "framer-motion";

interface PatternSelectorProps {
  selectedPattern: Pattern;
  onPatternChange: (pattern: Pattern) => void;
}

export function PatternSelector({
  selectedPattern,
  onPatternChange,
}: PatternSelectorProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4">
      <select
        value={selectedPattern.name}
        onChange={(e) => {
          const newPattern = patterns.find(
            (p: Pattern) => p.name === e.target.value
          );
          if (newPattern) onPatternChange(newPattern);
        }}
        className="px-4 py-2 sm:px-6 sm:py-3 text-white rounded-lg bg-[#3674B5]
                   border border-[#578FCA]/30 appearance-none cursor-pointer
                   hover:bg-[#3674B5]/90 transition-all duration-200 text-sm sm:text-base
                   w-full max-w-[250px] sm:max-w-none
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
      >
        {patterns.map((pattern: Pattern) => (
          <option 
            key={pattern.name} 
            value={pattern.name} 
            className="bg-slate-200 text-slate-800 dark:bg-gray-800 dark:text-white"
          >
            {pattern.name}
          </option>
        ))}
      </select>

      <div className="relative">
        <button
          onClick={() => setShowTooltip(!showTooltip)}
          className="flex items-center gap-2 text-slate-700 dark:text-white/70 hover:text-slate-900 dark:hover:text-white cursor-help transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
          aria-label="Show practice instructions"
        >
          <span className="text-base sm:text-lg">ℹ️</span>
          <span className="text-xs sm:text-sm font-medium">How to practice</span>
        </button>
        
        {showTooltip && (
          <>
            <div
              className="fixed inset-0 z-20 bg-black/20 dark:bg-black/40"
              onClick={() => setShowTooltip(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed left-4 right-4 sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:right-auto
                       top-1/2 sm:top-full -translate-y-1/2 sm:translate-y-0 sm:mt-3
                       p-5 rounded-xl border border-slate-200 dark:border-white/10
                       text-sm sm:text-base max-w-sm mx-auto shadow-xl z-30
                       bg-white dark:bg-gray-800
                       text-slate-700 dark:text-white/90"
            >
              <h4 className="font-semibold mb-3 text-slate-900 dark:text-white">
                {selectedPattern.name}
              </h4>
              <div className="space-y-2">
                {selectedPattern.description.split(";").map((step, i) => (
                  <p key={i} className="leading-relaxed text-slate-600 dark:text-slate-300">
                    <span className="text-pink-500 font-medium mr-2">{i + 1}.</span>
                    {step.trim()}
                  </p>
                ))}
              </div>
              <button
                onClick={() => setShowTooltip(false)}
                className="mt-4 w-full py-2 text-sm font-medium text-slate-500 hover:text-slate-700
                         dark:text-slate-400 dark:hover:text-slate-200 transition-colors
                         border border-slate-200 dark:border-white/10 rounded-lg
                         hover:bg-slate-50 dark:hover:bg-white/5"
              >
                Got it
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
