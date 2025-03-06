"use client";

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ThreeDVisualization } from '@/components/ThreeDVisualization';
import { Phase } from '@/lib/patterns';

interface EnhancedBreathingCircleProps {
  phase: Phase;
  timeRemaining: number;
  visualizationType: "circle" | "mandala" | "3d";
  primaryColor: string;
  secondaryColor?: string;
}

// Define phase-based styles
// const phaseColors: Record<Phase, string> = { ... };

const phaseGlow: Record<Phase, string> = {
  inhale: "shadow-blue-500/50",
  hold: "shadow-yellow-500/50",
  exhale: "shadow-purple-500/50",
  holdAfterExhale: "shadow-gray-500/50",
};

// Breathing animations
const breathingAnimation = {
  inhale: {
    scale: [1, 1.3],
    boxShadow: ["0 0 20px 5px rgba(59, 130, 246, 0.5)", "0 0 30px 10px rgba(59, 130, 246, 0.6)"],
    transition: {
      duration: 4, // Will be overridden by timeRemaining
      ease: "easeInOut",
    }
  },
  exhale: {
    scale: [1.3, 1],
    boxShadow: ["0 0 30px 10px rgba(236, 72, 153, 0.6)", "0 0 20px 5px rgba(236, 72, 153, 0.5)"],
    transition: {
      duration: 4, // Will be overridden by timeRemaining
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

export function EnhancedBreathingCircle({
  phase,
  timeRemaining,
  visualizationType = "circle",
  primaryColor = "#3674B5"
}: EnhancedBreathingCircleProps) {
  if (visualizationType === "3d") {
    return <ThreeDVisualization phase={phase} timeRemaining={timeRemaining} primaryColor={primaryColor} />;
  }
  
  if (visualizationType === "mandala") {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Background glow */}
        <motion.div
          className="absolute rounded-full"
          style={{
            background: `radial-gradient(circle, ${primaryColor}40 0%, transparent 70%)`,
            width: "300px",
            height: "300px",
          }}
          animate={{
            scale: phase === "inhale" ? [1, 1.5] : 
                  phase === "exhale" ? [1.5, 1] : 
                  phase === "hold" ? 1.5 : 1
          }}
          transition={{
            duration: timeRemaining,
            ease: "easeInOut"
          }}
        />
        
        {/* Mandala layers */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-dashed"
            style={{
              width: `${100 + i * 40}px`,
              height: `${100 + i * 40}px`,
              borderColor: i % 2 === 0 ? primaryColor : "#ffffff",
              opacity: 0.7 - i * 0.1,
            }}
            animate={{
              rotate: phase === "inhale" ? [0, 45] :
                     phase === "exhale" ? [45, 0] :
                     phase === "hold" ? 45 : 0,
              scale: phase === "inhale" ? [1, 1.2] :
                    phase === "exhale" ? [1.2, 1] :
                    phase === "hold" ? 1.2 : 1
            }}
            transition={{
              duration: timeRemaining,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Center circle */}
        <motion.div
          className="relative rounded-full flex flex-col items-center justify-center z-10"
          style={{
            background: `radial-gradient(circle, ${"#ffffff"}80, ${primaryColor}80)`,
            width: "100px",
            height: "100px",
            boxShadow: `0 0 20px 5px ${primaryColor}50`,
          }}
          animate={{
            scale: phase === "inhale" ? [1, 1.2] :
                  phase === "exhale" ? [1.2, 1] :
                  phase === "hold" ? 1.2 : 1,
            boxShadow: [
              `0 0 20px 5px ${primaryColor}50`,
              `0 0 30px 10px ${primaryColor}70`
            ]
          }}
          transition={{
            duration: timeRemaining,
            ease: "easeInOut"
          }}
        >
          <div className="text-lg font-semibold text-white capitalize">
            {phase === "holdAfterExhale" ? "Hold" : phase}
          </div>
          <div className="text-sm font-mono text-white/80">
            {Math.max(0, timeRemaining).toFixed(1)}s
          </div>
        </motion.div>
      </div>
    );
  }
  
  // Default circle visualization
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer glow */}
      <motion.div
        className={`absolute w-64 h-64 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full opacity-30 ${phaseGlow[phase]}`}
        style={{
          boxShadow: `0 0 60px 30px ${primaryColor}50`,
        }}
        animate={breathingAnimation[phase]}
      />

      {/* Rotating background particles */}
      <motion.div
        className="absolute w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Inner Circle */}
      <motion.div
        className="relative flex flex-col items-center justify-center w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 
                   rounded-full bg-black/40 backdrop-blur-md"
        style={{
          boxShadow: `0 0 20px 5px ${primaryColor}30`,
          border: `2px solid ${primaryColor}50`,
        }}
        animate={breathingAnimation[phase]}
      >
        {/* Text Container */}
        <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-white capitalize">
          {phase === "holdAfterExhale" ? "Hold" : phase}
        </div>

        {/* Timer Countdown */}
        <div className="text-base sm:text-lg md:text-xl font-mono text-white/80 mt-2">
          {Math.max(0, timeRemaining).toFixed(1)}s
        </div>
      </motion.div>
    </div>
  );
} 