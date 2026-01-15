"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Loader2, Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { AIRenderer } from "@/lib/ai-registry";
import { patterns, Pattern, StandardPattern } from "@/lib/patterns";
import type { AIComponent } from "@/lib/ai-catalog";

interface AICoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPremium: boolean;
}

const suggestedPrompts = [
  { label: "Quick calm", prompt: "I'm stressed and have 3 minutes to relax" },
  { label: "Better sleep", prompt: "Help me wind down before bed" },
  { label: "Morning energy", prompt: "I need to energize for my day" },
  { label: "Pre-meeting focus", prompt: "I have a big meeting in 5 minutes" },
  { label: "Create a program", prompt: "Create a 7-day program for stress reduction" },
  { label: "Anxiety relief", prompt: "I'm feeling anxious, help me calm down" },
];

export function AICoachModal({ isOpen, onClose, isPremium }: AICoachModalProps) {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedComponents, setGeneratedComponents] = useState<AIComponent[] | null>(null);
  const [currentProgram, setCurrentProgram] = useState<AIComponent | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setPrompt("");
      setGeneratedComponents(null);
      setError(null);
      setCurrentProgram(null);
    }
  }, [isOpen]);

  const getContext = () => {
    const hour = new Date().getHours();
    let timeOfDay = "day";
    if (hour < 6) timeOfDay = "early morning";
    else if (hour < 12) timeOfDay = "morning";
    else if (hour < 17) timeOfDay = "afternoon";
    else if (hour < 21) timeOfDay = "evening";
    else timeOfDay = "night";

    // Get session count from localStorage
    let sessionCount = 0;
    let favoritePattern: string | undefined;
    try {
      const sessions = JSON.parse(localStorage.getItem("breathBetterSessions") || "[]");
      sessionCount = sessions.length;

      // Find most used pattern
      if (sessions.length > 0) {
        const patternCounts: Record<string, number> = {};
        sessions.forEach((s: { patternName: string }) => {
          patternCounts[s.patternName] = (patternCounts[s.patternName] || 0) + 1;
        });
        favoritePattern = Object.entries(patternCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      }
    } catch {
      // Ignore localStorage errors
    }

    return { timeOfDay, sessionCount, favoritePattern };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedComponents(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          context: getContext(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate response");
      }

      setGeneratedComponents(data.components);

      // Check if there's a program in the response
      const programComponent = data.components.find(
        (c: AIComponent) => c.type === "Program"
      );
      if (programComponent) {
        setCurrentProgram(programComponent);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (action: { name: string; params: Record<string, unknown> }) => {
    if (action.name === "start_session") {
      const patternName = action.params.patternName as string;

      // Find the pattern in our patterns list
      const pattern = patterns.find((p) => p.name === patternName);

      if (pattern) {
        // Store the selected pattern and navigate to practice
        localStorage.setItem("breathBetterSelectedPattern", JSON.stringify(pattern));
        onClose();
        router.push("/practice");
      } else {
        // If pattern not found, try to match by partial name
        const matchedPattern = patterns.find((p) =>
          p.name.toLowerCase().includes(patternName.toLowerCase()) ||
          patternName.toLowerCase().includes(p.name.toLowerCase())
        );

        if (matchedPattern) {
          localStorage.setItem("breathBetterSelectedPattern", JSON.stringify(matchedPattern));
          onClose();
          router.push("/practice");
        } else {
          // Default to Box Breathing
          localStorage.setItem("breathBetterSelectedPattern", JSON.stringify(patterns[0]));
          onClose();
          router.push("/practice");
        }
      }
    } else if (action.name === "save_program" && currentProgram) {
      // Save the AI-generated program
      saveProgram(currentProgram);
    }
  };

  const saveProgram = (programComponent: AIComponent) => {
    const props = programComponent.props as {
      id: string;
      name: string;
      goal: string;
      totalDays: number;
    };

    // Extract patterns from the Day children
    const dayComponents = programComponent.children?.filter(
      (c) => c.type === "Day"
    ) || [];

    // Map day components to patterns
    const programPatterns: Pattern[] = dayComponents.map((day) => {
      const dayProps = day.props as {
        patternName: string;
        duration: number;
        focus: string;
      };

      // Find the existing pattern or create a default
      const existingPattern = patterns.find(
        (p) =>
          p.name === dayProps.patternName ||
          p.name.toLowerCase().includes(dayProps.patternName.toLowerCase())
      );

      if (existingPattern) {
        return existingPattern;
      }

      // Default to Box Breathing if pattern not found
      return {
        name: dayProps.patternName,
        description: `Day focus: ${dayProps.focus}`,
        durations: {
          inhale: 4,
          hold: 4,
          exhale: 4,
          holdAfterExhale: 4,
        },
      } as StandardPattern;
    });

    // Create the program structure
    const newProgram = {
      id: props.id,
      name: props.name,
      description: props.goal,
      icon: "sparkles",
      days: props.totalDays,
      patterns: programPatterns.length > 0 ? programPatterns : [patterns[0]],
    };

    // Save to localStorage
    try {
      const existingPrograms = JSON.parse(
        localStorage.getItem("breathBetterCustomPrograms") || "[]"
      );

      // Check if program with same ID exists
      const existingIndex = existingPrograms.findIndex(
        (p: { id: string }) => p.id === newProgram.id
      );

      if (existingIndex >= 0) {
        existingPrograms[existingIndex] = newProgram;
      } else {
        existingPrograms.push(newProgram);
      }

      localStorage.setItem(
        "breathBetterCustomPrograms",
        JSON.stringify(existingPrograms)
      );

      // Show success feedback
      setError(null);
      alert(`Program "${newProgram.name}" saved successfully! Go to the Programs tab to start it.`);
    } catch {
      setError("Failed to save program");
    }
  };

  const handleSuggestedPrompt = (suggestedPrompt: string) => {
    setPrompt(suggestedPrompt);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/75 dark:bg-black/75 flex items-center justify-center p-4 z-50"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] relative overflow-hidden text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">AI Breathing Coach</h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {!isPremium && (
              <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-lg p-3 mb-4">
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  AI Coach is a premium feature.
                  <a href="/premium" className="underline ml-1">Upgrade now</a> to unlock personalized breathing sessions.
                </p>
              </div>
            )}

            {/* Suggested prompts */}
            {!generatedComponents && !isLoading && (
              <div className="mb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                  Try one of these:
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestedPrompts.map((sp) => (
                    <button
                      key={sp.label}
                      onClick={() => handleSuggestedPrompt(sp.prompt)}
                      disabled={!isPremium}
                      className="text-xs px-3 py-1.5 rounded-full bg-white/10 border border-white/10
                               hover:bg-white/20 hover:border-blue-500/30 transition-all
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sp.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading state */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Creating your personalized session...
                  </p>
                </div>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {/* Generated content */}
            {generatedComponents && !isLoading && (
              <div className="mb-4">
                <AIRenderer tree={generatedComponents} onAction={handleAction} />
              </div>
            )}

            {/* Reset button when content is shown */}
            {generatedComponents && !isLoading && (
              <button
                onClick={() => {
                  setGeneratedComponents(null);
                  setPrompt("");
                  setCurrentProgram(null);
                }}
                className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300
                         transition-colors flex items-center gap-1"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Try another prompt
              </button>
            )}
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t border-slate-200 dark:border-white/10"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={isPremium ? "How can I help you breathe better?" : "Upgrade to use AI Coach"}
                disabled={!isPremium || isLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/10
                         placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                         disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              />
              <button
                type="submit"
                disabled={!isPremium || isLoading || !prompt.trim()}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white
                         hover:from-blue-600 hover:to-cyan-600 transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
