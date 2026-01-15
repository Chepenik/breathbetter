"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, Sparkles, X, ChevronDown, ChevronUp } from "lucide-react";
import { AIRenderer } from "@/lib/ai-registry";
import { patterns, Pattern, StandardPattern } from "@/lib/patterns";
import type { AIComponent } from "@/lib/ai-catalog";

interface AICoachInputProps {
  isPremium: boolean;
  onPatternSelect: (pattern: Pattern) => void;
  onProgramSave?: (program: AIComponent) => void;
}

const quickPrompts = [
  { label: "Quick calm", prompt: "I need to calm down in 3 minutes" },
  { label: "Sleep prep", prompt: "Help me wind down for sleep" },
  { label: "Energy boost", prompt: "I need energy for my day" },
  { label: "Focus mode", prompt: "Help me focus before a meeting" },
];

export function AICoachInput({ isPremium, onPatternSelect, onProgramSave }: AICoachInputProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedComponents, setGeneratedComponents] = useState<AIComponent[] | null>(null);
  const [currentProgram, setCurrentProgram] = useState<AIComponent | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const getContext = () => {
    const hour = new Date().getHours();
    let timeOfDay = "day";
    if (hour < 6) timeOfDay = "early morning";
    else if (hour < 12) timeOfDay = "morning";
    else if (hour < 17) timeOfDay = "afternoon";
    else if (hour < 21) timeOfDay = "evening";
    else timeOfDay = "night";

    let sessionCount = 0;
    let favoritePattern: string | undefined;
    try {
      const sessions = JSON.parse(localStorage.getItem("breathBetterSessions") || "[]");
      sessionCount = sessions.length;
      if (sessions.length > 0) {
        const patternCounts: Record<string, number> = {};
        sessions.forEach((s: { patternName: string }) => {
          patternCounts[s.patternName] = (patternCounts[s.patternName] || 0) + 1;
        });
        favoritePattern = Object.entries(patternCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      }
    } catch {
      // Ignore
    }

    return { timeOfDay, sessionCount, favoritePattern };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedComponents(null);
    setIsExpanded(true);

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

  const handleQuickPrompt = (quickPrompt: string) => {
    setPrompt(quickPrompt);
  };

  const handleAction = (action: { name: string; params: Record<string, unknown> }) => {
    if (action.name === "start_session") {
      const patternName = action.params.patternName as string;
      const pattern = patterns.find((p) => p.name === patternName) ||
        patterns.find((p) =>
          p.name.toLowerCase().includes(patternName.toLowerCase()) ||
          patternName.toLowerCase().includes(p.name.toLowerCase())
        ) ||
        patterns[0];

      onPatternSelect(pattern);
      clearResults();
    } else if (action.name === "save_program" && currentProgram) {
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

    const dayComponents = programComponent.children?.filter((c) => c.type === "Day") || [];

    const programPatterns: Pattern[] = dayComponents.map((day) => {
      const dayProps = day.props as {
        patternName: string;
        duration: number;
        focus: string;
      };

      const existingPattern = patterns.find(
        (p) =>
          p.name === dayProps.patternName ||
          p.name.toLowerCase().includes(dayProps.patternName.toLowerCase())
      );

      if (existingPattern) return existingPattern;

      return {
        name: dayProps.patternName,
        description: `Day focus: ${dayProps.focus}`,
        durations: { inhale: 4, hold: 4, exhale: 4, holdAfterExhale: 4 },
      } as StandardPattern;
    });

    const newProgram = {
      id: props.id,
      name: props.name,
      description: props.goal,
      icon: "sparkles",
      days: props.totalDays,
      patterns: programPatterns.length > 0 ? programPatterns : [patterns[0]],
    };

    try {
      const existingPrograms = JSON.parse(
        localStorage.getItem("breathBetterCustomPrograms") || "[]"
      );
      const existingIndex = existingPrograms.findIndex(
        (p: { id: string }) => p.id === newProgram.id
      );

      if (existingIndex >= 0) {
        existingPrograms[existingIndex] = newProgram;
      } else {
        existingPrograms.push(newProgram);
      }

      localStorage.setItem("breathBetterCustomPrograms", JSON.stringify(existingPrograms));
      setError(null);

      if (onProgramSave) {
        onProgramSave(programComponent);
      }

      alert(`Program "${newProgram.name}" saved! Check the Progress tab.`);
    } catch {
      setError("Failed to save program");
    }
  };

  const clearResults = () => {
    setGeneratedComponents(null);
    setPrompt("");
    setCurrentProgram(null);
    setError(null);
  };

  if (!isPremium) {
    return (
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-slate-600 dark:text-slate-400">
            AI Coach helps you find the perfect pattern.
          </span>
          <a href="/premium" className="text-sm text-blue-500 hover:text-blue-400 ml-auto">
            Unlock
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      {/* Input form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/10 focus-within:border-blue-500/50 transition-colors">
          <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="How are you feeling? What do you need?"
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
          />
          {prompt && !isLoading && (
            <button
              type="button"
              onClick={() => setPrompt("")}
              className="text-slate-400 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="text-blue-400 hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>

      {/* Quick prompts */}
      {!generatedComponents && !isLoading && (
        <div className="flex flex-wrap gap-2 mt-3 justify-center">
          {quickPrompts.map((qp) => (
            <button
              key={qp.label}
              onClick={() => handleQuickPrompt(qp.prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10
                       hover:bg-white/10 hover:border-blue-500/30 transition-all"
            >
              {qp.label}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {(generatedComponents || isLoading || error) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 overflow-hidden"
          >
            {/* Toggle button for results */}
            {generatedComponents && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300 mb-2"
              >
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {isExpanded ? "Collapse" : "Show"} AI suggestion
              </button>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Creating your session...</p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-sm text-red-500">{error}</p>
              </div>
            )}

            {/* Generated content */}
            {generatedComponents && isExpanded && (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-h-80 overflow-y-auto">
                <AIRenderer tree={generatedComponents} onAction={handleAction} />
                <button
                  onClick={clearResults}
                  className="mt-3 text-xs text-slate-400 hover:text-slate-300"
                >
                  Clear & try another
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
