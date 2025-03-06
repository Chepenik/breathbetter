"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Download, BarChart3, Palette, Calendar, Sliders } from "lucide-react";
import { SocialLinks } from "@/components/SocialLinks";
import { SupportButton } from "@/components/SupportButton";
import { isPremiumActive, activatePremium, getPremiumExpiryDate, deactivatePremium } from "@/lib/premium";

export default function PremiumPage() {
  const [premiumCode, setPremiumCode] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [activationSuccess, setActivationSuccess] = useState(false);
  const [deactivationSuccess, setDeactivationSuccess] = useState(false);
  
  // Check premium status on load
  useEffect(() => {
    setIsPremium(isPremiumActive());
    setExpiryDate(getPremiumExpiryDate());
  }, []);
  
  const handleActivate = () => {
    if (premiumCode.trim() === "") return;
    
    const success = activatePremium(premiumCode);
    if (success) {
      setActivationSuccess(true);
      setIsPremium(true);
      setExpiryDate(getPremiumExpiryDate());
      
      // Reset after 3 seconds
      setTimeout(() => {
        setActivationSuccess(false);
      }, 3000);
    }
  };
  
  const handleDeactivate = () => {
    deactivatePremium();
    setIsPremium(false);
    setExpiryDate(null);
    setDeactivationSuccess(true);
    
    // Redirect to practice page after a short delay
    setTimeout(() => {
      window.location.href = "/practice";
    }, 1500);
  };
  
  // For development only - quick activation without code
  const handleDevActivate = () => {
    activatePremium("DEV_CODE");
    setIsPremium(true);
    setExpiryDate(getPremiumExpiryDate());
    window.location.href = "/practice";
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-start gap-6 p-4 sm:p-6 md:p-8 pt-16 md:pt-20">
      <div className="w-full max-w-4xl">
        <Link 
          href="/"
          className="inline-flex items-center text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Home
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-600 mb-4">
            Breath Better Premium
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl mx-auto">
            Enhance your breathing practice with advanced features designed to deepen your experience.
          </p>
        </div>
        
        {isPremium ? (
          <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6 text-center mb-8">
            <div className="inline-flex items-center justify-center bg-green-500/20 rounded-full p-2 mb-4">
              <Check className="w-6 h-6 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-green-500 mb-2">Premium Features Activated</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Thank you for supporting Breath Better! You now have access to all premium features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/practice"
                className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg
                         hover:from-green-600 hover:to-emerald-600 transition-all duration-300 shadow-md"
              >
                Start Practicing
              </Link>
              
              <button
                onClick={handleDeactivate}
                className="inline-flex items-center px-5 py-2 bg-gray-500 text-white rounded-lg
                         hover:bg-gray-600 transition-all duration-300 shadow-md"
              >
                Prefer Simple App? Deactivate Premium
              </button>
            </div>
            
            {deactivationSuccess && (
              <div className="mt-4 p-3 bg-blue-500/20 rounded-lg text-center">
                <p className="text-blue-600 dark:text-blue-400">
                  Premium deactivated. You can reactivate anytime!
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-xl p-6 text-center mb-8">
            <h2 className="text-xl font-bold text-amber-500 mb-4">Premium is Currently Free!</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              While we set up our payment system, all premium features are available for free.
              If you enjoy Breath Better, please consider supporting us!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  // Activate premium for free during this period
                  activatePremium("BREATHBETTER_FREE_PREMIUM");
                  setIsPremium(true);
                }}
                className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-600 text-white rounded-lg
                         hover:from-amber-500 hover:to-yellow-700 transition-all duration-300 shadow-md"
              >
                Activate Premium
              </button>
              
              {/* Development only button */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={handleDevActivate}
                  className="px-5 py-2 bg-gray-500 text-white rounded-lg text-sm
                            hover:bg-gray-600 transition-all duration-300"
                >
                  DEV: Quick Activate
                </button>
              )}
            </div>
            
            {activationSuccess && (
              <div className="mt-4 p-3 bg-green-500/20 rounded-lg text-center">
                <p className="text-green-600 dark:text-green-400">
                  Premium activated successfully!
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Premium Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <FeatureCard 
            icon={<Calendar className="w-6 h-6 text-amber-500" />}
            title="Personalized Programs"
            description="Multi-day breathing programs designed for specific goals like better sleep, stress reduction, and improved focus."
          />
          
          <FeatureCard 
            icon={<Palette className="w-6 h-6 text-amber-500" />}
            title="Advanced Visualizations"
            description="Nature-inspired animations, mandalas, customizable colors, and 3D visualizations to enhance your practice."
          />
          
          <FeatureCard 
            icon={<BarChart3 className="w-6 h-6 text-amber-500" />}
            title="Statistics Dashboard"
            description="Track your progress with detailed statistics, session history, streaks, and exportable data."
          />
          
          <FeatureCard 
            icon={<Sliders className="w-6 h-6 text-amber-500" />}
            title="Custom Pattern Creator"
            description="Create and save your own breathing patterns with custom durations for each phase."
          />
        </div>
        
        <div className="text-center text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          <p className="mb-2">
            Premium features are currently free while we set up our payment system.
            In the future, a small fee will help support ongoing development.
          </p>
          <p>
            All core breathing functionality will always remain free and open source.
          </p>
        </div>
      </div>
      
      <SocialLinks />
      <SupportButton />
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.3)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-4">
        <div className="bg-amber-500/10 rounded-lg p-3">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
        </div>
      </div>
    </motion.div>
  );
} 