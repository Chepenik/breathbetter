"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export function Navigation() {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <nav className="absolute top-0 left-0 right-0 p-3 sm:p-4 z-10">
      <div className="max-w-7xl mx-auto">
        <Link href="/">
          <motion.div
            className="relative w-[50px] h-[50px] overflow-visible"
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Glow effect */}
            <motion.div 
              className="absolute inset-0 rounded-full"
              initial={{ opacity: 0.5, scale: 0.9 }}
              animate={{ 
                opacity: isHovering ? 0.8 : 0.5,
                scale: isHovering ? 1.2 : 0.9
              }}
              transition={{ duration: 0.5 }}
              style={{ 
                filter: "blur(8px)",
                background: "linear-gradient(to right, #3674B5, #FF748B)" 
              }}
            />
            
            {/* Rotating border */}
            <motion.div 
              className="absolute inset-0 rounded-full border-2 border-white/30"
              animate={{ 
                rotate: isHovering ? 360 : 0,
                borderWidth: isHovering ? "3px" : "2px",
                borderColor: isHovering ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.3)"
              }}
              transition={{ duration: 2, repeat: isHovering ? Infinity : 0, ease: "linear" }}
            />
            
            {/* Logo container */}
            <motion.div 
              className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-t-full flex items-center justify-center overflow-hidden"
              animate={{ 
                backgroundColor: isHovering ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.3)"
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ 
                  scale: isHovering ? 1.1 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <Image 
                  src="/breathbetterlogo.png" 
                  alt="Breath Better Logo" 
                  width={40} 
                  height={40}
                  className="rounded-t-full"
                />
              </motion.div>
            </motion.div>
            
            {/* Simplified particles effect on hover */}
            {isHovering && (
              <>
                {[...Array(4)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full"
                    initial={{ 
                      x: 25, 
                      y: 25, 
                      opacity: 1 
                    }}
                    animate={{ 
                      x: 25 + Math.cos(i * 90 * Math.PI / 180) * 35, 
                      y: 25 + Math.sin(i * 90 * Math.PI / 180) * 35,
                      opacity: 0
                    }}
                    transition={{ 
                      duration: 0.8,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                ))}
              </>
            )}
          </motion.div>
        </Link>
      </div>
    </nav>
  );
} 