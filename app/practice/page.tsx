"use client";

import { useState, useEffect } from "react";
import { PatternSelector } from "@/components/PatternSelector";
import { BreathingCircle } from "@/components/BreathingCircle";
import { BackgroundMusic } from "@/components/BackgroundMusic";
import { patterns, type Pattern, type Phase } from "@/lib/patterns";
import { SupportButton } from "@/components/SupportButton";
import { SocialLinks } from "@/components/SocialLinks";

export default function PracticePage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState<Pattern>(patterns[0]);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [timeRemaining, setTimeRemaining] = useState<number>(
    selectedPattern.sequence?.[0] ?? selectedPattern.durations.inhale ?? 4
  );
  const [sequenceIndex, setSequenceIndex] = useState(0);

  // Reset everything when pattern changes
  useEffect(() => {
    setIsPlaying(false);
    setPhase("inhale");
    setSequenceIndex(0);
    setTimeRemaining(
      selectedPattern.sequence?.[0] ?? 
      selectedPattern.durations.inhale ?? 
      4
    );
  }, [selectedPattern]);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const currentTime = prev ?? 0;

        if (currentTime <= 0.1) {
          if (selectedPattern.sequence) {
            if (phase === "inhale") {
              setPhase("exhale");
              return selectedPattern.sequence[sequenceIndex];
            } else if (phase === "exhale") {
              if (sequenceIndex === selectedPattern.sequence.length - 1) {
                setPhase("holdAfterExhale");
                return selectedPattern.durations.holdAfterExhale ?? 13;
              } else {
                const nextIndex = sequenceIndex + 1;
                setSequenceIndex(nextIndex);
                setPhase("inhale");
                return selectedPattern.sequence[nextIndex];
              }
            } else if (phase === "holdAfterExhale") {
              setSequenceIndex(0);
              setPhase("inhale");
              return selectedPattern.sequence[0];
            }
          } else {
            const nextPhase =
              phase === "inhale"
                ? "hold"
                : phase === "hold"
                ? "exhale"
                : phase === "exhale"
                ? "holdAfterExhale"
                : "inhale";

            setPhase(nextPhase);
            return selectedPattern.durations[nextPhase] ?? 4;
          }
        }

        return currentTime - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, phase, selectedPattern, sequenceIndex]);

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
    } else {
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const safeTimeRemaining = timeRemaining ?? 0;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-12 p-4 sm:p-6 md:p-8 pt-16 md:pt-20">
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Breath Better
        </h1>

        <PatternSelector
          selectedPattern={selectedPattern}
          onPatternChange={(newPattern) => {
            setSelectedPattern(newPattern);
          }}
        />
      </div>

      <div className="h-[240px] sm:h-[300px] md:h-[400px] w-full flex items-center justify-center">
        <BreathingCircle
          phase={phase}
          timeRemaining={safeTimeRemaining}
        />
      </div>

      <div className="flex gap-4">
        <button
          className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg
                     hover:from-pink-600 hover:to-violet-600 transition-all duration-300
                     shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base sm:text-lg"
          onClick={handlePlayPause}
        >
          {isPlaying ? "Stop" : "Start"}
        </button>
        
        <button
          className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg
                     hover:from-gray-600 hover:to-gray-700 transition-all duration-300
                     shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base sm:text-lg"
          onClick={toggleMute}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </div>

      <BackgroundMusic isPlaying={isPlaying} isMuted={isMuted} phase={phase} />
      
      <div className="text-center text-sm text-gray-500 max-w-md">
        <p>The background music volume will briefly lower during breathing phase transitions, 
        helping you follow the pattern with your eyes closed.</p>
      </div>
      
      <SocialLinks />
      
      {/* Support Button - Bottom Right */}
      <div className="fixed bottom-4 right-4">
        <SupportButton />
      </div>
    </div>
  );
} 