"use client";

import { useState, useEffect } from "react";
import { PatternSelector } from "@/compoenents/PatternSelector";
import { BreathingCircle } from "@/compoenents/BreathingCircle";
import { BackgroundMusic } from "@/compoenents/BackgroundMusic";
import { patterns, type Pattern, type Phase } from "@/lib/patterns";
import { SupportButton } from "@/components/SupportButton";

export default function PracticePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<Pattern>(patterns[0]);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [timeRemaining, setTimeRemaining] = useState<number>(
    selectedPattern.sequence?.[0] ?? selectedPattern.durations.inhale ?? 4
  );
  const [progress, setProgress] = useState(0);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);

  // Reset everything when pattern changes
  useEffect(() => {
    // Stop the current pattern if it's playing
    setIsPlaying(false);
    // Reset to initial phase
    setPhase("inhale");
    // Reset sequence index
    setSequenceIndex(0);
    // Reset time remaining to the new pattern's initial duration
    setTimeRemaining(
      selectedPattern.sequence?.[0] ?? 
      selectedPattern.durations.inhale ?? 
      4
    );
    // Reset progress
    setProgress(0);
  }, [selectedPattern]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        // Ensure prev has a default value
        const currentTime = prev ?? 0;

        // If time is up or nearly up (within 0.1s)
        if (currentTime <= 0.1) {
          const nextPhase =
            phase === "inhale"
              ? "hold"
              : phase === "hold"
              ? "exhale"
              : phase === "exhale"
              ? "holdAfterExhale"
              : "inhale";

          setPhase(nextPhase);
          setProgress(0);

          // Handle spiral breathing sequence
          if (selectedPattern.sequence) {
            if (nextPhase === "inhale") {
              const nextIndex = (sequenceIndex + 1) % selectedPattern.sequence.length;
              setSequenceIndex(nextIndex);
              return selectedPattern.sequence[nextIndex];
            } else if (nextPhase === "hold" || nextPhase === "exhale") {
              return selectedPattern.sequence[sequenceIndex];
            } else if (nextPhase === "holdAfterExhale") {
              return selectedPattern.durations.holdAfterExhale ?? 13;
            }
          }

          // For non-sequence patterns, use the durations from the pattern
          return (
            selectedPattern.durations[nextPhase] ??
            selectedPattern.durations.inhale ??
            4
          );
        }

        // Update progress for the current phase
        const newTime = currentTime - 0.1;
        const duration = (() => {
          if (selectedPattern.sequence) {
            if (phase === "holdAfterExhale") {
              return selectedPattern.durations.holdAfterExhale ?? 13;
            }
            return selectedPattern.sequence[sequenceIndex];
          }
          return (
            selectedPattern.durations[phase] ??
            selectedPattern.durations.inhale ??
            4
          );
        })();

        setProgress(1 - newTime / duration);
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, phase, selectedPattern, sequenceIndex]);

  // Reset everything when stopping
  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
      setPhase("inhale");
      setSequenceIndex(0);
      setTimeRemaining(
        selectedPattern.sequence?.[0] ??
        selectedPattern.durations.inhale ??
        4
      );
      setProgress(0);
    } else {
      setIsPlaying(true);
    }
  };

  // Ensure timeRemaining is always a number for the BreathingCircle component
  const safeTimeRemaining = timeRemaining ?? 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-12 p-8">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Breath Better
        </h1>

        <PatternSelector
          selectedPattern={selectedPattern}
          onPatternChange={(newPattern) => {
            setSelectedPattern(newPattern);
          }}
        />
      </div>

      <div className="h-[300px] md:h-[400px] flex items-center justify-center">
        <BreathingCircle
          phase={phase}
          progress={progress}
          isActive={isPlaying}
          timeRemaining={safeTimeRemaining}
        />
      </div>

      <button
        className="px-6 py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg
                   hover:from-pink-600 hover:to-violet-600 transition-all duration-300
                   shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        onClick={handlePlayPause}
      >
        {isPlaying ? "Stop" : "Start"}
      </button>

      <BackgroundMusic isPlaying={isPlaying} />
      
      <SupportButton />
    </div>
  );
} 