"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="absolute top-0 left-0 right-0 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link 
          href="/" 
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
        >
          Breath Better
        </Link>
        
        {isHome ? (
          <Link
            href="/practice"
            className="px-4 py-2 text-white/80 hover:text-white transition-colors"
          >
            Practice →
          </Link>
        ) : (
          <Link
            href="/"
            className="px-4 py-2 text-white/80 hover:text-white transition-colors"
          >
            ← Home
          </Link>
        )}
      </div>
    </nav>
  );
} 