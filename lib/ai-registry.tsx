"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Play, Save, Sparkles, Lightbulb, Moon, Zap, Target, Trophy } from 'lucide-react';
import type { AIComponent } from './ai-catalog';

interface RendererProps {
  element: AIComponent;
  onAction: (action: { name: string; params: Record<string, unknown> }) => void;
  children?: React.ReactNode;
}

// Individual component renderers
function SessionIntroRenderer({ element }: RendererProps) {
  const { title, description, estimatedMinutes } = element.props as {
    title: string;
    description: string;
    estimatedMinutes: number;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4 mb-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{description}</p>
      <p className="text-xs text-slate-500">
        Duration: ~{estimatedMinutes} minute{estimatedMinutes !== 1 ? 's' : ''}
      </p>
    </motion.div>
  );
}

function BreathingExerciseRenderer({ element }: RendererProps) {
  const { patternName, duration, guidance } = element.props as {
    patternName: string;
    duration: number;
    guidance: string;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-lg p-4 mb-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <Target className="w-4 h-4 text-amber-400" />
        <span className="font-medium">{patternName}</span>
        <span className="text-xs text-slate-500 ml-auto">{duration} min</span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">{guidance}</p>
    </motion.div>
  );
}

function GuidanceRenderer({ element }: RendererProps) {
  const { text, timing } = element.props as {
    text: string;
    timing: 'before' | 'during' | 'after';
  };

  const timingColors = {
    before: 'from-green-500/10 to-emerald-500/10 border-green-500/20',
    during: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
    after: 'from-purple-500/10 to-violet-500/10 border-purple-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r ${timingColors[timing]} border rounded-lg p-3 mb-3`}
    >
      <p className="text-sm italic text-slate-600 dark:text-slate-400">&ldquo;{text}&rdquo;</p>
      <p className="text-xs text-slate-500 mt-1 capitalize">{timing} session</p>
    </motion.div>
  );
}

function TipRenderer({ element }: RendererProps) {
  const { content } = element.props as { content: string };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-3"
    >
      <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-slate-600 dark:text-slate-400">{content}</p>
    </motion.div>
  );
}

function StartSessionButtonRenderer({ element, onAction }: RendererProps) {
  const { label, patternName } = element.props as {
    label: string;
    patternName: string;
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onAction({ name: 'start_session', params: { patternName } })}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg
                 hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 font-medium shadow-lg"
    >
      <Play className="w-5 h-5" />
      {label}
    </motion.button>
  );
}

function ProgramRenderer({ element, onAction, children }: RendererProps) {
  const { name, goal, totalDays } = element.props as {
    id: string;
    name: string;
    goal: string;
    totalDays: number;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-lg p-4 mb-4"
    >
      <div className="flex items-center gap-2 mb-2">
        <Moon className="w-5 h-5 text-amber-400" />
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{goal}</p>
      <p className="text-xs text-slate-500 mb-4">{totalDays} days</p>

      <div className="space-y-2 max-h-60 overflow-y-auto">
        {children}
      </div>
    </motion.div>
  );
}

function DayRenderer({ element }: RendererProps) {
  const { dayNumber, focus, patternName, duration, tip } = element.props as {
    dayNumber: number;
    focus: string;
    patternName: string;
    duration: number;
    tip?: string;
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-sm">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium">Day {dayNumber}: {focus}</span>
        <span className="text-xs text-slate-500">{duration} min</span>
      </div>
      <p className="text-xs text-slate-500">{patternName}</p>
      {tip && (
        <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
          <Lightbulb className="w-3 h-3" /> {tip}
        </p>
      )}
    </div>
  );
}

function MilestoneRenderer({ element }: RendererProps) {
  const { afterDay, message } = element.props as {
    afterDay: number;
    message: string;
  };

  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-2 text-sm">
      <Trophy className="w-4 h-4 text-green-400" />
      <div>
        <span className="text-xs text-green-400">After Day {afterDay}</span>
        <p className="text-slate-600 dark:text-slate-400">{message}</p>
      </div>
    </div>
  );
}

function SaveProgramButtonRenderer({ element, onAction }: RendererProps) {
  const { label, programId } = element.props as {
    label: string;
    programId: string;
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onAction({ name: 'save_program', params: { programId } })}
      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-400 to-yellow-600 text-white rounded-lg
                 hover:from-amber-500 hover:to-yellow-700 transition-all duration-300 font-medium shadow-lg mt-4"
    >
      <Save className="w-5 h-5" />
      {label}
    </motion.button>
  );
}

function CustomPatternRenderer({ element }: RendererProps) {
  const { name, description, inhale, hold, exhale, holdAfterExhale } = element.props as {
    name: string;
    description: string;
    inhale: number;
    hold: number;
    exhale: number;
    holdAfterExhale: number;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4 mb-3"
    >
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5 text-purple-400" />
        <h4 className="font-medium">{name}</h4>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{description}</p>
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div className="bg-white/5 rounded p-2">
          <div className="text-lg font-bold text-blue-400">{inhale}s</div>
          <div className="text-slate-500">Inhale</div>
        </div>
        <div className="bg-white/5 rounded p-2">
          <div className="text-lg font-bold text-yellow-400">{hold}s</div>
          <div className="text-slate-500">Hold</div>
        </div>
        <div className="bg-white/5 rounded p-2">
          <div className="text-lg font-bold text-pink-400">{exhale}s</div>
          <div className="text-slate-500">Exhale</div>
        </div>
        <div className="bg-white/5 rounded p-2">
          <div className="text-lg font-bold text-gray-400">{holdAfterExhale}s</div>
          <div className="text-slate-500">Rest</div>
        </div>
      </div>
    </motion.div>
  );
}

// Registry mapping component types to renderers
const componentRegistry: Record<string, React.FC<RendererProps>> = {
  SessionIntro: SessionIntroRenderer,
  BreathingExercise: BreathingExerciseRenderer,
  Guidance: GuidanceRenderer,
  Tip: TipRenderer,
  StartSessionButton: StartSessionButtonRenderer,
  Program: ProgramRenderer,
  Day: DayRenderer,
  Milestone: MilestoneRenderer,
  SaveProgramButton: SaveProgramButtonRenderer,
  CustomPattern: CustomPatternRenderer,
};

// Main renderer component
interface AIRendererProps {
  tree: AIComponent[];
  onAction: (action: { name: string; params: Record<string, unknown> }) => void;
}

export function AIRenderer({ tree, onAction }: AIRendererProps) {
  const renderComponent = (component: AIComponent): React.ReactNode => {
    const Component = componentRegistry[component.type];

    if (!Component) {
      console.warn(`Unknown component type: ${component.type}`);
      return null;
    }

    const children = component.children?.map((child, index) => (
      <React.Fragment key={index}>
        {renderComponent(child)}
      </React.Fragment>
    ));

    return (
      <Component
        key={component.type + JSON.stringify(component.props)}
        element={component}
        onAction={onAction}
      >
        {children}
      </Component>
    );
  };

  return (
    <div className="space-y-2">
      {tree.map((component, index) => (
        <React.Fragment key={index}>
          {renderComponent(component)}
        </React.Fragment>
      ))}
    </div>
  );
}
