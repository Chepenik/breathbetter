"use client";

import { useState } from "react";
import { Pattern, StandardPattern, SequencePattern } from "@/lib/patterns";

interface CustomPatternCreatorProps {
  onSavePattern: (pattern: Pattern) => void;
}

export function CustomPatternCreator({ onSavePattern }: CustomPatternCreatorProps) {
  const [patternName, setPatternName] = useState("");
  const [patternDescription, setPatternDescription] = useState("");
  const [inhaleTime, setInhaleTime] = useState(4);
  const [holdTime, setHoldTime] = useState(4);
  const [exhaleTime, setExhaleTime] = useState(4);
  const [holdAfterExhaleTime, setHoldAfterExhaleTime] = useState(0);
  const [isSequence, setIsSequence] = useState(false);
  const [sequence, setSequence] = useState<number[]>([]);
  const [sequenceInput, setSequenceInput] = useState("");
  const [error, setError] = useState("");
  
  const handleAddToSequence = () => {
    if (!sequenceInput.trim()) return;
    
    const value = parseFloat(sequenceInput);
    if (isNaN(value) || value <= 0) {
      setError("Please enter a valid positive number");
      return;
    }
    
    setSequence([...sequence, value]);
    setSequenceInput("");
    setError("");
  };
  
  const handleRemoveFromSequence = (index: number) => {
    setSequence(sequence.filter((_, i) => i !== index));
  };
  
  const handleSave = () => {
    if (!patternName.trim()) {
      setError("Pattern name is required");
      return;
    }
    
    let newPattern: Pattern;
    
    if (isSequence && sequence.length > 0) {
      // Create a SequencePattern
      newPattern = {
        name: patternName,
        description: patternDescription || "Custom breathing pattern",
        sequence: sequence,
        durations: {
          holdAfterExhale: holdAfterExhaleTime
        }
      } as SequencePattern;
    } else {
      // Create a StandardPattern
      newPattern = {
        name: patternName,
        description: patternDescription || "Custom breathing pattern",
        durations: {
          inhale: inhaleTime,
          hold: holdTime,
          exhale: exhaleTime,
          holdAfterExhale: holdAfterExhaleTime
        }
      } as StandardPattern;
    }
    
    onSavePattern(newPattern);
    
    // Reset form
    setPatternName("");
    setPatternDescription("");
    setInhaleTime(4);
    setHoldTime(4);
    setExhaleTime(4);
    setHoldAfterExhaleTime(0);
    setIsSequence(false);
    setSequence([]);
    setSequenceInput("");
    setError("");
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Create Custom Pattern</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Pattern Name</label>
          <input
            type="text"
            value={patternName}
            onChange={(e) => setPatternName(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="e.g., My Custom Pattern"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description (Optional)</label>
          <textarea
            value={patternDescription}
            onChange={(e) => setPatternDescription(e.target.value)}
            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            placeholder="Describe your breathing pattern..."
            rows={2}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isSequence"
            checked={isSequence}
            onChange={(e) => setIsSequence(e.target.checked)}
            className="rounded border-white/10 text-amber-500 focus:ring-amber-500"
          />
          <label htmlFor="isSequence" className="text-sm">
            Use sequence-based pattern
          </label>
        </div>
        
        {isSequence ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="number"
                value={sequenceInput}
                onChange={(e) => setSequenceInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="Duration in seconds"
                min="0.1"
                step="0.1"
              />
              <button
                onClick={handleAddToSequence}
                className="px-3 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                Add
              </button>
            </div>
            
            {sequence.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">Sequence</label>
                <div className="flex flex-wrap gap-2">
                  {sequence.map((value, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-lg"
                    >
                      <span className="text-sm">{value}s</span>
                      <button
                        onClick={() => handleRemoveFromSequence(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  The sequence will alternate between inhale and exhale.
                </p>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">Hold After Exhale (seconds)</label>
              <input
                type="number"
                value={holdAfterExhaleTime}
                onChange={(e) => setHoldAfterExhaleTime(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                min="0"
                step="0.5"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Inhale (seconds)</label>
              <input
                type="number"
                value={inhaleTime}
                onChange={(e) => setInhaleTime(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                min="0.5"
                step="0.5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Hold (seconds)</label>
              <input
                type="number"
                value={holdTime}
                onChange={(e) => setHoldTime(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                min="0"
                step="0.5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Exhale (seconds)</label>
              <input
                type="number"
                value={exhaleTime}
                onChange={(e) => setExhaleTime(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                min="0.5"
                step="0.5"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Hold After Exhale (seconds)</label>
              <input
                type="number"
                value={holdAfterExhaleTime}
                onChange={(e) => setHoldAfterExhaleTime(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                min="0"
                step="0.5"
              />
            </div>
          </div>
        )}
        
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
        
        <button
          onClick={handleSave}
          className="w-full px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-600 text-white rounded-lg
                   hover:from-amber-500 hover:to-yellow-700 transition-all duration-300"
        >
          Save Pattern
        </button>
      </div>
    </div>
  );
} 