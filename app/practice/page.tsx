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
import { AICoachInput } from "@/components/AICoachInput";
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
  const [activeTab, setActiveTab] = useState("breathe");
  const [isLoading, setIsLoading] = useState(true);

  // Check premium status and handle AI Coach pattern selection
  useEffect(() => {
    const premium = isPremiumActive();
    setIsPremium(premium);

    // Check for pattern selected by AI Coach
    const aiSelectedPattern = localStorage.getItem('breathBetterSelectedPattern');
    if (aiSelectedPattern) {
      try {
        const pattern = JSON.parse(aiSelectedPattern) as Pattern;
        const existingPattern = patterns.find(p => p.name === pattern.name);
        if (existingPattern) {
          setSelectedPattern(existingPattern);
        } else {
          setSelectedPattern(pattern);
        }
        localStorage.removeItem('breathBetterSelectedPattern');
      } catch {
        // Ignore parsing errors
      }
    }

    // Load custom patterns if premium
    if (premium) {
      const savedPatterns = localStorage.getItem('breathBetterCustomPatterns');
      if (savedPatterns) {
        const customPatterns = JSON.parse(savedPatterns) as Pattern[];
        customPatterns.forEach(pattern => {
          if (!patterns.some(p => p.name === pattern.name)) {
            const validPattern = pattern.sequence
              ? {
                  name: pattern.name,
                  description: pattern.description,
                  sequence: pattern.sequence,
                  durations: { holdAfterExhale: pattern.durations.holdAfterExhale || 0 }
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

    setIsLoading(false);
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

  const handlePatternChange = (newPattern: Pattern) => {
    setSelectedPattern(newPattern);
    setPhase("inhale");
    setSequenceIndex(0);
    setTimeRemaining(
      newPattern.sequence?.[0] ??
      newPattern.durations.inhale ??
      4
    );
  };

  const handlePlayPause = () => {
    if (isPlaying) {
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

  const handleDeactivatePremium = () => {
    deactivatePremium();
    window.location.reload();
  };

  const safeTimeRemaining = timeRemaining ?? 0;

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-12 p-4 sm:p-6 md:p-8 pt-16 md:pt-20">
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          <div className="h-10 w-48 bg-gradient-to-r from-pink-500/20 to-violet-500/20 rounded-lg animate-pulse" />
          <div className="h-12 w-64 bg-slate-200/20 dark:bg-white/10 rounded-lg animate-pulse" />
        </div>
        <div className="h-[240px] sm:h-[300px] md:h-[400px] w-full flex items-center justify-center">
          <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-56 md:h-56 rounded-full bg-slate-200/20 dark:bg-white/10 animate-pulse" />
        </div>
        <div className="flex gap-4">
          <div className="h-12 w-24 bg-slate-200/20 dark:bg-white/10 rounded-lg animate-pulse" />
          <div className="h-12 w-24 bg-slate-200/20 dark:bg-white/10 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-12 p-4 sm:p-6 md:p-8 pt-16 md:pt-20">
      <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-3xl">
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Breath Better
        </h1>

        {isPremium ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 max-w-xs mx-auto">
              <TabsTrigger value="breathe">Breathe</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>

            <TabsContent value="breathe" className="flex flex-col items-center gap-4">
              {/* AI Coach Input */}
              <AICoachInput
                isPremium={isPremium}
                onPatternSelect={handlePatternChange}
                onProgramSave={() => setActiveTab("progress")}
              />

              {/* Divider */}
              <div className="flex items-center gap-3 w-full max-w-md">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-slate-500">or pick a pattern</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Pattern Selector */}
              <PatternSelector
                selectedPattern={selectedPattern}
                onPatternChange={handlePatternChange}
              />

              {/* Visualization Settings */}
              <VisualizationSettings
                onVisualizationChange={setVisualizationType}
                onColorChange={setPrimaryColor}
              />

              {/* Go back to standard */}
              <button
                onClick={handleDeactivatePremium}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-400 transition-colors"
              >
                <ArrowLeft size={12} />
                Standard Version
              </button>
            </TabsContent>

            <TabsContent value="progress" className="space-y-6">
              {/* Stats Dashboard */}
              <StatsDashboard />

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-slate-500">Programs</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Personalized Programs */}
              <PersonalizedPrograms
                onSelectPattern={(pattern) => {
                  handlePatternChange(pattern);
                  setActiveTab("breathe");
                }}
                onStartProgram={() => setActiveTab("breathe")}
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="flex flex-col items-center gap-4">
            {/* AI Coach teaser for non-premium */}
            <AICoachInput
              isPremium={false}
              onPatternSelect={handlePatternChange}
            />

            <PatternSelector
              selectedPattern={selectedPattern}
              onPatternChange={handlePatternChange}
            />
          </div>
        )}
      </div>

      {/* Breathing Circle - always visible */}
      <div className="h-[240px] sm:h-[300px] md:h-[400px] w-full flex items-center justify-center">
        <EnhancedBreathingCircle
          phase={phase}
          timeRemaining={safeTimeRemaining}
          visualizationType={isPremium ? visualizationType : "circle" as const}
          primaryColor={isPremium ? primaryColor : "#3674B5"}
        />
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-pink-500 to-violet-500 text-white rounded-lg
                     hover:from-pink-600 hover:to-violet-600 transition-all duration-200
                     shadow-lg hover:shadow-xl text-base sm:text-lg
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
          onClick={handlePlayPause}
          aria-label={isPlaying ? "Stop breathing exercise" : "Start breathing exercise"}
        >
          {isPlaying ? "Stop" : "Start"}
        </button>

        <button
          className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg
                     hover:from-gray-600 hover:to-gray-700 transition-all duration-200
                     shadow-lg hover:shadow-xl text-base sm:text-lg
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute background music" : "Mute background music"}
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>
      </div>

      <BackgroundMusic isPlaying={isPlaying} isMuted={isMuted} phase={phase} />

      {/* Helper text */}
      <p className="text-center text-sm text-slate-400 dark:text-slate-500 max-w-sm">
        {isPlaying
          ? "Follow the circle. Let your breath flow naturally."
          : "Press Start when you're ready. Close your eyes if it helps."}
      </p>

      {/* Premium upsell for non-premium users */}
      {!isPremium && (
        <div className="mt-4 text-center">
          <Link
            href="/premium"
            className="inline-flex items-center gap-1.5 text-sm text-amber-600 dark:text-amber-400
                       hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          >
            <Sparkles size={14} />
            <span>Explore premium features</span>
          </Link>
        </div>
      )}

      <SocialLinks />

      {/* Support Button */}
      <div className="fixed bottom-4 right-4">
        <SupportButton />
      </div>
    </div>
  );
}
