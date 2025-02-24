"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type Phase } from "@/lib/patterns";

interface BreathingCircleProps {
  phase: Phase;
  progress: number;
  isActive: boolean;
  timeRemaining: number;
}

export function BreathingCircle({
  phase,
  progress,
  isActive,
  timeRemaining,
}: BreathingCircleProps) {
  // Define phase-based styles
  const phaseColors: Record<Phase, string> = {
    inhale: "bg-gradient-to-r from-blue-400 via-teal-400 to-green-400",
    hold: "bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400",
    exhale: "bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500",
    holdAfterExhale: "bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700",
  };

  const phaseGlow: Record<Phase, string> = {
    inhale: "shadow-blue-500/50",
    hold: "shadow-yellow-500/50",
    exhale: "shadow-purple-500/50",
    holdAfterExhale: "shadow-gray-500/50",
  };

  // Update scale animation logic based on phase
  const getScaleAnimation = () => {
    switch (phase) {
      case "inhale":
        return {
          scale: [1, 1.3],
          transition: {
            duration: timeRemaining,
            ease: "easeInOut",
          }
        };
      case "exhale":
        return {
          scale: [1.3, 1],
          transition: {
            duration: timeRemaining,
            ease: "easeInOut",
          }
        };
      case "hold":
      case "holdAfterExhale":
        return {
          scale: phase === "hold" ? 1.3 : 1,
          transition: {
            duration: 0,
          }
        };
    }
  };

  // Add lava lamp effect colors
  const lavaColors = [
    "from-blue-400/30",
    "via-purple-500/30",
    "to-pink-500/30",
  ];

  return (
    <div className="relative flex items-center justify-center">
      {/* Animated Outer Ring - reduced size */}
      <motion.div
        className={`absolute w-48 h-48 md:w-64 md:h-64 rounded-full border-[8px] ${
          phaseColors[phase]
        } shadow-[0_0_30px_8px] ${phaseGlow[phase]}`}
        animate={getScaleAnimation()}
      />

      {/* Lava Lamp Background - reduced size */}
      <motion.div
        className={`absolute w-40 h-40 md:w-56 md:h-56 rounded-full 
                   bg-gradient-radial ${lavaColors.join(' ')} opacity-50`}
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Additional Lava Blobs - reduced size */}
      <motion.div
        className={`absolute w-40 h-40 md:w-56 md:h-56 rounded-full 
                   bg-gradient-conic from-purple-500/20 via-pink-500/20 to-blue-400/20`}
        animate={{
          rotate: -360,
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Inner Circle - reduced size */}
      <motion.div
        className="relative flex flex-col items-center justify-center w-40 h-40 md:w-56 md:h-56 
                   rounded-full bg-black/40 backdrop-blur-md"
        animate={getScaleAnimation()}
      >
        {/* Text Container */}
        <div className="text-3xl font-semibold text-white capitalize">
          {phase === "holdAfterExhale" ? "Hold" : phase}
        </div>

        {/* Timer Countdown */}
        <div className="text-xl font-mono text-white/80 mt-2">
          {Math.max(0, timeRemaining).toFixed(1)}s
        </div>
      </motion.div>
    </div>
  );
}
