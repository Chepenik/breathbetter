"use client";

import { patterns, type Pattern } from "@/lib/patterns";

interface PatternSelectorProps {
  selectedPattern: Pattern;
  onPatternChange: (pattern: Pattern) => void;
}

export function PatternSelector({
  selectedPattern,
  onPatternChange,
}: PatternSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <select
        value={selectedPattern.name}
        onChange={(e) => {
          const newPattern = patterns.find(
            (p: Pattern) => p.name === e.target.value
          );
          if (newPattern) onPatternChange(newPattern);
        }}
        className="px-6 py-3 bg-gray-800 text-white rounded-lg
                   border border-gray-700 focus:outline-none focus:ring-2
                   focus:ring-pink-500 appearance-none cursor-pointer
                   hover:bg-gray-700 transition-all duration-300"
        style={{ backgroundColor: 'rgb(31 41 55)' }}
      >
        {patterns.map((pattern: Pattern) => (
          <option 
            key={pattern.name} 
            value={pattern.name} 
            className="bg-gray-800 text-white"
            style={{ backgroundColor: 'rgb(31 41 55)' }}
          >
            {pattern.name}
          </option>
        ))}
      </select>

      <div className="relative group">
        <div className="flex items-center gap-2 text-white/70 hover:text-white cursor-help transition-colors">
          <span className="text-lg">ℹ️</span>
          <span className="text-sm">How to practice</span>
        </div>
        <div
          className="absolute hidden group-hover:block top-full mt-2 p-4
                     bg-white/10 backdrop-blur-md rounded-lg border border-white/20
                     text-white text-sm w-72 shadow-xl z-10"
        >
          {selectedPattern.description.split(";").map((step, i) => (
            <p key={i} className="mb-2 last:mb-0">
              {step.trim()}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
