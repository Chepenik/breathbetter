"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { isPremiumActive } from "@/lib/premium";
import { Pattern, Phase } from "@/lib/patterns";

interface CustomPatternCreatorProps {
  onSavePattern: (pattern: Pattern) => void;
}

export function CustomPatternCreator({ onSavePattern }: CustomPatternCreatorProps) {
  const [isPremium, setIsPremium] = useState(false);
  const [patternName, setPatternName] = useState("");
  const [patternDescription, setPatternDescription] = useState("");
  const [inhaleTime, setInhaleTime] = useState(4);
  const [holdTime, setHoldTime] = useState(4);
  const [exhaleTime, setExhaleTime] = useState(4);
  const [holdAfterExhaleTime, setHoldAfterExhaleTime] = useState(0);
  const [useSequence, setUseSequence] = useState(false);
  const [sequence, setSequence] = useState<number[]>([4, 4]);
  
  // Check premium status
  useEffect(() => {
    setIsPremium(isPremiumActive());
  }, []);
  
  const handleAddSequenceStep = () => {
    setSequence([...sequence, 4]);
  };
  
  const handleRemoveSequenceStep = (index: number) => {
    const newSequence = [...sequence];
    newSequence.splice(index, 1);
    setSequence(newSequence);
  };
  
  const handleUpdateSequenceStep = (index: number, value: number) => {
    const newSequence = [...sequence];
    newSequence[index] = value;
    setSequence(newSequence);
  };
  
  const handleSavePattern = () => {
    if (!patternName) {
      alert("Please enter a pattern name");
      return;
    }
    
    const newPattern: Pattern = {
      name: patternName,
      description: patternDescription || "Custom breathing pattern",
      durations: {
        inhale: inhaleTime,
        hold: holdTime,
        exhale: exhaleTime,
        holdAfterExhale: holdAfterExhaleTime,
      },
      sequence: useSequence ? sequence : undefined,
    };
    
    onSavePattern(newPattern);
    
    // Reset form
    setPatternName("");
    setPatternDescription("");
    setInhaleTime(4);
    setHoldTime(4);
    setExhaleTime(4);
    setHoldAfterExhaleTime(0);
    setUseSequence(false);
    setSequence([4, 4]);
  };
  
  if (!isPremium) {
    return (
      <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-lg p-4 text-center">
        <h3 className="text-lg font-medium text-amber-500 mb-2">Premium Feature</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Create and save your own custom breathing patterns with Premium.
        </p>
        <a
          href="/premium"
          className="inline-block px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-600 text-white text-sm rounded-lg
                   hover:from-amber-500 hover:to-yellow-700 transition-all duration-300"
        >
          Unlock Premium
        </a>
      </div>
    );
  }
  
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
      <h3 className="text-lg font-medium mb-4">Create Custom Pattern</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Pattern Name</label>
          <input
            type="text"
            value={patternName}
            onChange={(e) => setPatternName(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="My Custom Pattern"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description (optional)</label>
          <textarea
            value={patternDescription}
            onChange={(e) => setPatternDescription(e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Instructions for your pattern"
            rows={2}
          />
        </div>
        
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="useSequence"
            checked={useSequence}
            onChange={(e) => setUseSequence(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="useSequence" className="text-sm">
            Use alternating sequence instead of fixed durations
          </label>
        </div>
        
        {!useSequence ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Inhale (seconds)</label>
              <input
                type="number"
                min="1"
                max="20"
                value={inhaleTime}
                onChange={(e) => setInhaleTime(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Hold (seconds)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={holdTime}
                onChange={(e) => setHoldTime(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Exhale (seconds)</label>
              <input
                type="number"
                min="1"
                max="20"
                value={exhaleTime}
                onChange={(e) => setExhaleTime(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Hold After Exhale (seconds)</label>
              <input
                type="number"
                min="0"
                max="20"
                value={holdAfterExhaleTime}
                onChange={(e) => setHoldAfterExhaleTime(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-sm font-medium mb-1">Sequence (alternating inhale/exhale durations)</label>
            
            {sequence.map((duration, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm w-16">{index % 2 === 0 ? "Inhale" : "Exhale"}</span>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={duration}
                  onChange={(e) => handleUpdateSequenceStep(index, Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                {sequence.length > 2 && (
                  <button
                    onClick={() => handleRemoveSequenceStep(index)}
                    className="p-2 text-red-400 hover:text-red-300"
                    aria-label="Remove step"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
            
            <button
              onClick={handleAddSequenceStep}
              className="flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300"
            >
              <Plus size={16} /> Add Step
            </button>
          </div>
        )}
        
        <button
          onClick={handleSavePattern}
          className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-600 text-white rounded-lg
                   hover:from-amber-500 hover:to-yellow-700 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <Save size={16} /> Save Pattern
        </button>
      </div>
    </div>
  );
} 