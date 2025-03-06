"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Phase } from '@/lib/patterns';

interface ThreeDVisualizationProps {
  phase: Phase;
  timeRemaining: number;
  primaryColor: string;
}

export function ThreeDVisualization({ 
  phase, 
  timeRemaining,
  primaryColor 
}: ThreeDVisualizationProps) {
  // Simplified 3D-like visualization using CSS transforms instead of three.js
  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-800">
      {/* Background glow */}
      <motion.div
        className="absolute rounded-full opacity-30"
        style={{
          width: '300px',
          height: '300px',
          background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)`,
          filter: 'blur(20px)',
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
      
      {/* 3D Cube */}
      <motion.div
        className="relative w-40 h-40 transform-style-3d"
        animate={{
          rotateX: phase === "inhale" ? [0, 45] : 
                  phase === "exhale" ? [45, 0] : 
                  phase === "hold" ? 45 : 0,
          rotateY: phase === "inhale" ? [0, 45] : 
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
      >
        {/* Cube faces */}
        {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face, i) => (
          <div 
            key={face}
            className="absolute w-full h-full border-2 border-white/30 backdrop-blur-md"
            style={{
              background: `linear-gradient(45deg, ${primaryColor}40, transparent)`,
              transform: 
                face === 'front' ? 'translateZ(70px)' :
                face === 'back' ? 'translateZ(-70px) rotateY(180deg)' :
                face === 'right' ? 'translateX(70px) rotateY(90deg)' :
                face === 'left' ? 'translateX(-70px) rotateY(-90deg)' :
                face === 'top' ? 'translateY(-70px) rotateX(90deg)' :
                'translateY(70px) rotateX(-90deg)',
              boxShadow: `0 0 10px ${primaryColor}80 inset`
            }}
          />
        ))}
        
        {/* Text container */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center z-10"
          style={{
            transform: 'translateZ(71px)',
          }}
        >
          <div className="text-xl font-semibold text-white capitalize">
            {phase === "holdAfterExhale" ? "Hold" : phase}
          </div>
          <div className="text-base font-mono text-white/80 mt-1">
            {Math.max(0, timeRemaining).toFixed(1)}s
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 