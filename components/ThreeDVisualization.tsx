"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Phase } from '@/lib/patterns';

interface ThreeDVisualizationProps {
  phase: Phase;
  timeRemaining: number;
  primaryColor: string;
  secondaryColor?: string;
}

export function ThreeDVisualization({ 
  phase, 
  timeRemaining,
  primaryColor,
  secondaryColor = "#ffffff" 
}: ThreeDVisualizationProps) {
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, speed: number}>>([]);
  
  // Generate particles on component mount
  useEffect(() => {
    // Reduced number of particles for less visual noise
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1, // Slightly smaller particles
      speed: Math.random() * 1.5 + 0.5
    }));
    setParticles(newParticles);
  }, []);

  // Calculate animation properties based on breathing phase
  const getScaleAnimation = () => {
    switch(phase) {
      case "inhale": return [1, 1.4]; // More pronounced expansion
      case "exhale": return [1.4, 1]; // More pronounced contraction
      case "hold":
      case "holdAfterExhale": return phase === "hold" ? 1.4 : 1; // Different sizes for different holds
      default: return 1;
    }
  };

  // Get phase-specific color
  const getPhaseColor = () => {
    switch(phase) {
      case "inhale": return primaryColor;
      case "exhale": return secondaryColor;
      case "hold": return `${primaryColor}`;
      case "holdAfterExhale": return `${secondaryColor}`;
      default: return primaryColor;
    }
  };

  // Get phase-specific text
  const getPhaseText = () => {
    switch(phase) {
      case "inhale": return "Breathe In";
      case "exhale": return "Breathe Out";
      case "hold": return "Hold Full";
      case "holdAfterExhale": return "Hold Empty";
      default: return phase;
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center perspective-1200 overflow-hidden">
      {/* Phase indicator background */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{
          background: phase === "inhale" ? `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)` :
                    phase === "exhale" ? `radial-gradient(circle, ${secondaryColor} 0%, transparent 70%)` :
                    phase === "hold" ? `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)` :
                    `radial-gradient(circle, ${secondaryColor} 0%, transparent 70%)`
        }}
        animate={{
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Main breathing circle */}
      <motion.div
        className="absolute rounded-full"
        style={{
          border: `3px solid ${getPhaseColor()}`,
          boxShadow: `0 0 30px ${getPhaseColor()}80`,
          width: '250px',
          height: '250px',
        }}
        animate={{
          scale: getScaleAnimation(),
        }}
        transition={{
          duration: timeRemaining,
          ease: "easeInOut"
        }}
      />
      
      {/* Particle system - fewer particles for clarity */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: getPhaseColor(),
              boxShadow: `0 0 ${particle.size * 2}px ${getPhaseColor()}`,
            }}
            animate={{
              x: phase === "inhale" ? [0, particle.speed * 20] : 
                  phase === "exhale" ? [particle.speed * 20, 0] : 
                  0,
              y: phase === "inhale" ? [0, particle.speed * -20] : 
                  phase === "exhale" ? [particle.speed * -20, 0] : 
                  0,
              opacity: phase === "inhale" || phase === "exhale" ? [0.2, 0.7, 0.2] : [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: timeRemaining,
              ease: "easeInOut",
              opacity: {
                duration: particle.speed * 3,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
          />
        ))}
      </div>
      
      {/* 3D Geometric Shape - Simplified for clarity */}
      <motion.div
        className="relative w-40 h-40 transform-style-3d"
        animate={{
          rotateY: phase === "inhale" ? [0, 180] : 
                  phase === "exhale" ? [180, 360] : 
                  phase === "hold" ? 180 : 0,
          scale: getScaleAnimation(),
        }}
        transition={{
          duration: timeRemaining,
          ease: "easeInOut"
        }}
      >
        {/* Simplified geometric shape - just a cube */}
        {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face) => (
          <motion.div 
            key={face}
            className="absolute w-full h-full backdrop-blur-sm"
            style={{
              background: `linear-gradient(45deg, ${getPhaseColor()}40, transparent)`,
              border: `1px solid ${getPhaseColor()}60`,
              transform: 
                face === 'front' ? 'translateZ(70px)' :
                face === 'back' ? 'translateZ(-70px)' :
                face === 'right' ? 'translateX(70px) rotateY(90deg)' :
                face === 'left' ? 'translateX(-70px) rotateY(-90deg)' :
                face === 'top' ? 'translateY(-70px) rotateX(90deg)' :
                'translateY(70px) rotateX(-90deg)',
              boxShadow: `0 0 10px ${getPhaseColor()}60 inset`
            }}
            animate={{
              opacity: [0.6, 0.9, 0.6]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>

      {/* Clear phase indicator text */}
      <motion.div
        className="absolute flex flex-col items-center justify-center z-20"
        style={{
          top: '60%',
          background: `rgba(0,0,0,0.4)`,
          backdropFilter: 'blur(4px)',
          padding: '8px 16px',
          borderRadius: '8px',
          border: `1px solid ${getPhaseColor()}40`,
        }}
        animate={{
          y: [0, -5, 0],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="text-xl font-semibold text-white capitalize drop-shadow-glow">
          {getPhaseText()}
        </div>
        <div className="text-lg font-mono text-white/90 mt-1 drop-shadow-glow">
          {Math.max(0, timeRemaining).toFixed(1)}s
        </div>
      </motion.div>

      {/* Phase-specific indicators */}
      {phase === "inhale" && (
        <motion.div
          className="absolute rounded-full border-2 border-dashed"
          style={{
            borderColor: primaryColor,
            width: '350px',
            height: '350px',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {phase === "exhale" && (
        <motion.div
          className="absolute rounded-full border-2 border-dashed"
          style={{
            borderColor: secondaryColor,
            width: '350px',
            height: '350px',
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.6, 0.3, 0.6],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
      
      {(phase === "hold" || phase === "holdAfterExhale") && (
        <motion.div
          className="absolute rounded-full"
          style={{
            background: `${getPhaseColor()}20`,
            width: phase === "hold" ? '300px' : '200px',
            height: phase === "hold" ? '300px' : '200px',
          }}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      )}
    </div>
  );
}

// Add this to your global CSS
// .drop-shadow-glow {
//   filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.7));
// } 