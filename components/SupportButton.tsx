"use client";

import { useState } from "react";
import TipButton from "./TipButton";
import { motion } from "framer-motion";

export function SupportButton() {
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      <motion.button
        onClick={() => setIsTipModalOpen(true)}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-4 right-4 px-5 py-2.5 rounded-full
                 z-10 text-sm md:text-base shadow-md overflow-hidden"
      >
        {/* Background glow */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full opacity-80"
          animate={{ 
            scale: isHovering ? [1, 1.05, 1] : 1,
          }}
          transition={{ 
            duration: 1.5, 
            repeat: isHovering ? Infinity : 0,
            ease: "easeInOut" 
          }}
        />
        
        {/* Pulsing border */}
        <motion.div 
          className="absolute inset-0 rounded-full border-2 border-white/40"
          animate={{ 
            scale: isHovering ? [1, 1.08, 1] : 1,
            borderColor: isHovering ? ["rgba(255,255,255,0.4)", "rgba(255,255,255,0.7)", "rgba(255,255,255,0.4)"] : "rgba(255,255,255,0.4)"
          }}
          transition={{ 
            duration: 2, 
            repeat: isHovering ? Infinity : 0,
            ease: "easeInOut" 
          }}
        />
        
        {/* Text container */}
        <motion.div 
          className="relative flex items-center justify-center gap-2 text-white font-medium"
          animate={{ 
            y: isHovering ? [0, -2, 0] : 0
          }}
          transition={{ 
            duration: 1, 
            repeat: isHovering ? Infinity : 0,
            ease: "easeInOut" 
          }}
        >
          <span>Support</span>
          
          {/* Animated heart */}
          <motion.span
            animate={{ 
              scale: isHovering ? [1, 1.3, 1] : 1,
              rotate: isHovering ? [0, 10, -10, 0] : 0
            }}
            transition={{ 
              duration: 0.8, 
              repeat: isHovering ? Infinity : 0,
              ease: "easeInOut" 
            }}
            className="inline-block"
          >
            ❤️
          </motion.span>
        </motion.div>
        
        {/* Floating particles */}
        {isHovering && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ 
                  x: "50%", 
                  y: "50%", 
                  opacity: 1 
                }}
                animate={{ 
                  x: `calc(50% + ${Math.cos(i * 120 * Math.PI / 180) * 30}px)`, 
                  y: `calc(50% + ${Math.sin(i * 120 * Math.PI / 180) * 30}px)`,
                  opacity: 0
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: i * 0.2
                }}
              />
            ))}
          </>
        )}
      </motion.button>

      <TipButton 
        isOpen={isTipModalOpen}
        onClose={() => setIsTipModalOpen(false)}
      />
    </>
  );
} 