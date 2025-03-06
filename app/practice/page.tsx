"use client";

import { useState, useEffect, useCallback } from "react";
import { patterns, type Pattern, type Phase, StandardPattern, SequencePattern } from "@/lib/patterns";
import { PatternSelector } from "@/components/PatternSelector";
import { EnhancedBreathingCircle } from "@/components/EnhancedBreathingCircle";
import { BackgroundMusic } from "@/components/BackgroundMusic";
import { SocialLinks } from "@/components/SocialLinks";
import { SupportButton } from "@/components/SupportButton";
import { VisualizationSettings, VisualizationType } from "@/components/VisualizationSettings";
import { StatsDashboard } from "@/components/StatsDashboard";
import { PersonalizedPrograms } from "@/components/PersonalizedPrograms";
import { CustomPatternCreator } from "@/components/CustomPatternCreator";
import { isPremiumActive, deactivatePremium } from "@/lib/premium";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PracticePage() {
  const [selectedPattern, setSelectedPattern] = useState<Pattern>(patterns[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [phase, setPhase] = useState<Phase>("inhale");
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [visualizationType, setVisualizationType] = useState<VisualizationType>("circle");
  const [primaryColor, setPrimaryColor] = useState("#3674B5");
  const [isPremium, setIsPremium] = useState(false);
  const [activeTab, setActiveTab] = useState("practice");
  
  // Check premium status
  useEffect(() => {
    setIsPremium(isPremiumActive());
    
    // Load custom patterns if premium
    if (isPremiumActive()) {
      const savedPatterns = localStorage.getItem('breathBetterCustomPatterns');
      if (savedPatterns) {
        const customPatterns = JSON.parse(savedPatterns) as Pattern[];
        // Add custom patterns to the patterns array
        customPatterns.forEach(pattern => {
          if (!patterns.some(p => p.name === pattern.name)) {
            // Ensure pattern has required properties before adding
            const validPattern = pattern.sequence 
              ? {
                  name: pattern.name,
                  description: pattern.description,
                  sequence: pattern.sequence,
                  durations: {
                    holdAfterExhale: pattern.durations.holdAfterExhale || 0
                  }
                } as SequencePattern
              : {
                  name: pattern.name,
                  description: pattern.description,
                  durations: {
                    inhale: pattern.durations.inhale || 4,
                    hold: pattern.durations.hold || 4,
                    exhale: pattern.durations.exhale || 4,
                    holdAfterExhale: pattern.durations.holdAfterExhale || 0
                  }
                } as StandardPattern;
            patterns.push(validPattern);
          }
        });
      }
    }
  }, []);
  
  // Record session when completed
  const recordSession = useCallback((duration: number, completed: boolean) => {
    if (!isPremiumActive()) return;
    
    const session = {
      date: new Date().toISOString(),
      pattern: selectedPattern.name,
      duration,
      completed
    };
    
    const savedSessions = localStorage.getItem('breathBetterSessions');
    const sessions = savedSessions ? JSON.parse(savedSessions) : [];
    sessions.push(session);
    localStorage.setItem('breathBetterSessions', JSON.stringify(sessions));
  }, [selectedPattern.name]);

  // Initialize timeRemaining
  useEffect(() => {
    if (timeRemaining === null) {
      setTimeRemaining(
        selectedPattern.sequence?.[0] ??
        selectedPattern.durations.inhale ??
        4
      );
    }
  }, [selectedPattern, timeRemaining]);

  // Main breathing timer
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const currentTime = prev ?? 0;

        if (currentTime <= 0.1) {
          if (selectedPattern.sequence) {
            if (phase === "inhale") {
              setPhase("exhale");
              return selectedPattern.sequence[sequenceIndex];
            } else if (phase === "exhale") {
              if (sequenceIndex === selectedPattern.sequence.length - 1) {
                setPhase("holdAfterExhale");
                return selectedPattern.durations.holdAfterExhale ?? 0;
              } else {
                const nextIndex = sequenceIndex + 1;
                setSequenceIndex(nextIndex);
                setPhase("inhale");
                return selectedPattern.sequence[nextIndex];
              }
            } else if (phase === "holdAfterExhale") {
              setSequenceIndex(0);
              setPhase("inhale");
              return selectedPattern.sequence[0];
            }
          } else {
            const nextPhase =
              phase === "inhale"
                ? "hold"
                : phase === "hold"
                ? "exhale"
                : phase === "exhale"
                ? "holdAfterExhale"
                : "inhale";

            setPhase(nextPhase);
            return selectedPattern.durations[nextPhase] ?? 4;
          }
        }

        return currentTime - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying, phase, selectedPattern, sequenceIndex]);

  const handlePlayPause = () => {
    if (isPlaying) {
      // Record the session when stopping
      recordSession(
        selectedPattern.sequence?.reduce((a, b) => a + b, 0) || 
        Object.values(selectedPattern.durations).reduce((a, b) => a + (b || 0), 0),
        true
      );
      
      setIsPlaying(false);
      setPhase("inhale");
      setSequenceIndex(0);
      setTimeRemaining(
        selectedPattern.sequence?.[0] ??
        selectedPattern.durations.inhale ??
        4
      );
    } else {
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleSaveCustomPattern = (pattern: Pattern) => {
    // Add to patterns array 
    let newPattern: Pattern;
    
    if (pattern.sequence && pattern.sequence.length > 0) {
      // Create a SequencePattern
      newPattern = {
        name: pattern.name,
        description: pattern.description,
        sequence: pattern.sequence,
        durations: {
          holdAfterExhale: pattern.durations.holdAfterExhale || 0
        }
      } as SequencePattern;
    } else {
      // Create a StandardPattern
      newPattern = {
        name: pattern.name,
        description: pattern.description,
        durations: {
          inhale: pattern.durations.inhale || 4,
          hold: pattern.durations.hold || 4,
          exhale: pattern.durations.exhale || 4,
          holdAfterExhale: pattern.durations.holdAfterExhale || 0
        }
      } as StandardPattern;
    }
    
    patterns.push(newPattern);
    
    // Save to localStorage
    const savedPatterns = localStorage.getItem('breathBetterCustomPatterns');
    const customPatterns = savedPatterns ? JSON.parse(savedPatterns) : [];
    customPatterns.push(newPattern);
    localStorage.setItem('breathBetterCustomPatterns', JSON.stringify(customPatterns));
  };

  const safeTimeRemaining = timeRemaining ?? 0;

  // Add a function to handle deactivating premium
  const handleDeactivatePremium = () => {
    deactivatePremium();
    // Reload the page to show standard version
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-12 p-4 sm:p-6 md:p-8 pt-16 md:pt-20">
      <div className="flex flex-col items-center gap-4 sm:gap-6">
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Breath Better
        </h1>
        
        {isPremium ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-3xl">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="practice">Practice</TabsTrigger>
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
            
            <TabsContent value="practice" className="flex flex-col items-center">
              <div className="flex flex-col gap-4">
                <PatternSelector
                  selectedPattern={selectedPattern}
                  onPatternChange={(newPattern) => {
                    setSelectedPattern(newPattern);
                    setPhase("inhale");
                    setSequenceIndex(0);
                    setTimeRemaining(
                      newPattern.sequence?.[0] ??
                      newPattern.durations.inhale ??
                      4
                    );
                  }}
                />
                
                {/* Add the "Go Back to Standard" button */}
                <button
                  onClick={handleDeactivatePremium}
                  className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  <ArrowLeft size={14} />
                  Go Back to Standard Version
                </button>
                
                <VisualizationSettings
                  onVisualizationChange={setVisualizationType}
                  onColorChange={setPrimaryColor}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="programs">
              <PersonalizedPrograms
                onSelectPattern={(pattern) => {
                  setSelectedPattern(pattern);
                  setPhase("inhale");
                  setSequenceIndex(0);
                  setTimeRemaining(
                    pattern.sequence?.[0] ??
                    pattern.durations.inhale ??
                    4
                  );
                  setActiveTab("practice");
                }}
                onStartProgram={() => setActiveTab("practice")}
              />
            </TabsContent>
            
            <TabsContent value="custom">
              <CustomPatternCreator onSavePattern={handleSaveCustomPattern} />
            </TabsContent>
            
            <TabsContent value="stats">
              <StatsDashboard />
            </TabsContent>
          </Tabs>
        ) : (
          <>
            <PatternSelector
              selectedPattern={selectedPattern}
              onPatternChange={(newPattern) => {
                setSelectedPattern(newPattern);
                setPhase("inhale");
                setSequenceIndex(0);
                setTimeRemaining(
                  newPattern.sequence?.[0] ??
                  newPattern.durations.inhale ??
                  4
                );
              }}
            />
            

            <Link
              href="/premium"
              className="flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 mt-2"
            >
              <Sparkles size={14} />
              Unlock Premium Features
            </Link>
          </>
        )}
      </div>

      <div className="h-[240px] sm:h-[300px] md:h-[400px] w-full flex items-center justify-center">
        <EnhancedBreathingCircle
          phase={phase}
          timeRemaining={safeTimeRemaining}
          visualizationType={isPremium ? visualizationType : "circle" as const}
          primaryColor={isPremium ? primaryColor : "#3674B5"}
        />
      </div>

      <div className="flex gap-4">
        <button
          className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg
                     hover:from-pink-600 hover:to-violet-600 transition-all duration-300
                     shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base sm:text-lg"
          onClick={handlePlayPause}
        >
          {isPlaying ? "Stop" : "Start"}
        </button>
        
        <button
          className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg
                     hover:from-gray-600 hover:to-gray-700 transition-all duration-300
                     shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-base sm:text-lg"
          onClick={toggleMute}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </div>

      <BackgroundMusic isPlaying={isPlaying} isMuted={isMuted} phase={phase} />
      
      <div className="text-center text-sm text-gray-500 max-w-md">
        <p>Each breathing transition is marked with a subtle vinyl record scratch sound, 
        allowing you to follow the rhythm with your eyes closed for deeper immersion.</p>
      </div>
      
      <SocialLinks />
      
      {/* Support Button - Bottom Right */}
      <div className="fixed bottom-4 right-4">
        <SupportButton />
      </div>
    </div>
  );
} 