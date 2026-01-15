"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export function Navigation() {
  return (
    <nav className="absolute top-0 left-0 right-0 p-3 sm:p-4 z-10">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/"
          className="inline-block rounded-full focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-pink-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        >
          <motion.div
            className="relative w-[50px] h-[50px] overflow-visible"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Subtle glow effect */}
            <div
              className="absolute inset-0 rounded-full opacity-50"
              style={{
                filter: "blur(8px)",
                background: "linear-gradient(to right, #3674B5, #FF748B)"
              }}
            />

            {/* Border */}
            <div className="absolute inset-0 rounded-full border-2 border-white/30" />

            {/* Logo container */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center overflow-hidden">
              <Image
                src="/breathbetterlogo.png"
                alt="Breath Better - Home"
                width={40}
                height={40}
                className="rounded-full"
              />
            </div>
          </motion.div>
        </Link>
      </div>
    </nav>
  );
} 