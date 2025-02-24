"use client";

import Link from "next/link";

export function Navigation() {
  return (
    <nav className="absolute top-0 left-0 right-0 p-4">
      <div className="max-w-7xl mx-auto">
        <Link 
          href="/" 
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500"
        >
          Breath Better
        </Link>
      </div>
    </nav>
  );
} 