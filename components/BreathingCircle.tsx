"use client";

import { motion } from "framer-motion";
import { type Phase } from "@/lib/patterns";

interface BreathingCircleProps {
  phase: Phase;
  timeRemaining: number;
}

export function BreathingCircle({
  phase,
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

  // Add this to your BreathingCircle component
  const breathingAnimation = {
    inhale: {
      scale: [1, 1.3],
      boxShadow: ["0 0 20px 5px rgba(59, 130, 246, 0.5)", "0 0 30px 10px rgba(59, 130, 246, 0.6)"],
      transition: {
        duration: timeRemaining,
        ease: "easeInOut",
      }
    },
    exhale: {
      scale: [1.3, 1],
      boxShadow: ["0 0 30px 10px rgba(236, 72, 153, 0.6)", "0 0 20px 5px rgba(236, 72, 153, 0.5)"],
      transition: {
        duration: timeRemaining,
        ease: "easeInOut",
      }
    },
    hold: {
      scale: 1.3,
      boxShadow: "0 0 30px 10px rgba(234, 179, 8, 0.6)",
      transition: {
        duration: 0,
      }
    },
    holdAfterExhale: {
      scale: 1,
      boxShadow: "0 0 20px 5px rgba(107, 114, 128, 0.5)",
      transition: {
        duration: 0,
      }
    }
  };

  // Add lava lamp effect colors
  const lavaColors = [
    "from-blue-400/30",
    "via-purple-500/30",
    "to-pink-500/30",
  ];

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Animated Outer Ring - further reduced size for mobile */}
      <motion.div
        className={`absolute w-36 h-36 sm:w-44 sm:h-44 md:w-64 md:h-64 rounded-full border-[6px] sm:border-[8px] ${
          phaseColors[phase]
        }`}
        animate={breathingAnimation[phase]}
      />

      {/* Lava Lamp Background - further reduced size for mobile */}
      <motion.div
        className={`absolute w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-full 
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

      {/* Additional Lava Blobs - further reduced size for mobile */}
      <motion.div
        className={`absolute w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-full 
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

      {/* Inner Circle - further reduced size for mobile */}
      <motion.div
        className="relative flex flex-col items-center justify-center w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 
                   rounded-full bg-black/40 backdrop-blur-md"
        animate={breathingAnimation[phase]}
      >
        {/* Text Container - smaller text on mobile */}
        <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-white capitalize">
          {phase === "holdAfterExhale" ? "Hold" : phase}
        </div>

        {/* Timer Countdown - smaller text on mobile */}
        <div className="text-base sm:text-lg md:text-xl font-mono text-white/80 mt-2">
          {Math.max(0, timeRemaining).toFixed(1)}s
        </div>
      </motion.div>
    </div>
  );
}
