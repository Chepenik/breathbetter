"use client";

import { patterns, type Pattern } from "@/lib/patterns";
import { useState } from "react";

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
        className="px-4 py-2 sm:px-6 sm:py-3 text-white rounded-lg
                   border border-[#578FCA]/30 focus:outline-none focus:ring-2
                   focus:ring-[#FF748B] appearance-none cursor-pointer
                   hover:bg-[#3674B5]/80 transition-all duration-300 text-sm sm:text-base w-full max-w-[250px] sm:max-w-none"
        style={{ backgroundColor: 'var(--color-primary, #3674B5)' }}
      >
        {patterns.map((pattern: Pattern) => (
          <option 
            key={pattern.name} 
            value={pattern.name} 
            className="bg-gray-800 text-white dark:bg-gray-800 dark:text-white bg-slate-200 text-slate-800"
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
              className="fixed inset-0 z-20" 
              onClick={() => setShowTooltip(false)}
              aria-hidden="true"
            />
            <div
              className="absolute top-full mt-2 p-4 sm:p-5
                       rounded-lg border border-slate-300 dark:border-white/20 
                       text-sm sm:text-base w-72 sm:w-80 shadow-xl z-30
                       bg-white/90 dark:bg-gray-800/90 backdrop-blur-md
                       text-slate-700 dark:text-white/90"
            >
              <h4 className="font-semibold mb-2 text-slate-900 dark:text-white">
                {selectedPattern.name}
              </h4>
              {selectedPattern.description.split(";").map((step, i) => (
                <p key={i} className="mb-2 last:mb-0 leading-relaxed">
                  {i+1}. {step.trim()}
                </p>
              ))}
              <button 
                onClick={() => setShowTooltip(false)}
                className="mt-3 text-xs text-pink-500 hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300 font-medium"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
