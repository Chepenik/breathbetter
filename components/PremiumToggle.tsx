"use client";

import { useState, useEffect } from "react";
import { isPremiumActive, setPremiumActive } from "@/lib/premium";

export function PremiumToggle() {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(isPremiumActive());
  }, []);

  const togglePremium = () => {
    const newState = !isActive;
    setPremiumActive(newState);
    setIsActive(newState);
    // Force reload to apply premium changes throughout the app
    window.location.reload();
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <span className="text-sm font-medium">
        {isActive ? "Premium Active" : "Premium Inactive"}
      </span>
      <button
        onClick={togglePremium}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          isActive ? "bg-indigo-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isActive ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
} 