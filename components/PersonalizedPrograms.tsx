"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Moon, Brain, Heart, Zap } from "lucide-react";
import { isPremiumActive } from "@/lib/premium";
import { Pattern, StandardPattern, SequencePattern } from "@/lib/patterns";

interface Program {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  days: number;
  patterns: Pattern[];
  currentDay?: number;
  completed?: boolean;
}

interface PersonalizedProgramsProps {
  onSelectPattern: (pattern: Pattern) => void;
  onStartProgram: () => void;
}

export function PersonalizedPrograms({ onSelectPattern, onStartProgram }: PersonalizedProgramsProps) {
  const [isPremium, setIsPremium] = useState(false);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);
  const [showDetails, setShowDetails] = useState<string | null>(null);
  
  // Define programs
  useEffect(() => {
    const predefinedPrograms: Program[] = [
      {
        id: "sleep",
        name: "Better Sleep",
        description: "A 7-day program to help you fall asleep faster and improve sleep quality",
        icon: "moon",
        days: 7,
        patterns: [
          {
            name: "4-7-8 Breathing",
            description: "Inhale through your nose for 4 seconds; Hold your breath for 7 seconds; Exhale completely through your mouth for 8 seconds",
            durations: {
              inhale: 4,
              hold: 7,
              exhale: 8,
              holdAfterExhale: 0
            }
          },
          {
            name: "Extended Exhale",
            description: "Inhale through your nose for 4 seconds; Exhale slowly through your mouth for 6 seconds; Repeat",
            durations: {
              inhale: 4,
              hold: 0,
              exhale: 6,
              holdAfterExhale: 0
            }
          }
        ]
      },
      {
        id: "stress",
        name: "Stress Reduction",
        description: "A 14-day program to help manage stress and anxiety",
        icon: "brain",
        days: 14,
        patterns: [
          {
            name: "Box Breathing",
            description: "Inhale for 4 seconds; Hold for 4 seconds; Exhale for 4 seconds; Hold for 4 seconds",
            durations: {
              inhale: 4,
              hold: 4,
              exhale: 4,
              holdAfterExhale: 4
            }
          },
          {
            name: "Calming Breath",
            description: "Inhale for 4 seconds; Hold briefly; Exhale for 6 seconds; Pause briefly",
            durations: {
              inhale: 4,
              hold: 1,
              exhale: 6,
              holdAfterExhale: 1
            }
          }
        ]
      },
      {
        id: "energy",
        name: "Energy Boost",
        description: "A 5-day program to increase energy and alertness",
        icon: "zap",
        days: 5,
        patterns: [
          {
            name: "Stimulating Breath",
            description: "Quick inhales and exhales through the nose; Keep the mouth closed; Aim for 3 cycles per second",
            sequence: [1, 1, 1, 1, 1, 1],
            durations: {
              holdAfterExhale: 0
            }
          } as SequencePattern,
          {
            name: "Bellows Breath",
            description: "Inhale and exhale rapidly through your nose; Keep the breaths equal in duration",
            durations: {
              inhale: 2,
              hold: 0,
              exhale: 2,
              holdAfterExhale: 0
            }
          } as StandardPattern
        ]
      },
      {
        id: "focus",
        name: "Improved Focus",
        description: "A 10-day program to enhance concentration and mental clarity",
        icon: "heart",
        days: 10,
        patterns: [
          {
            name: "4-4-4-4 Breathing",
            description: "Inhale for 4 seconds; Hold for 4 seconds; Exhale for 4 seconds; Hold for 4 seconds",
            durations: {
              inhale: 4,
              hold: 4,
              exhale: 4,
              holdAfterExhale: 4
            }
          },
          {
            name: "Alternate Nostril",
            description: "Breathe through one nostril at a time; Inhale for 4, hold for 2, exhale for 4; Alternate sides",
            durations: {
              inhale: 4,
              hold: 2,
              exhale: 4,
              holdAfterExhale: 0
            }
          }
        ]
      }
    ];
    
    // Load active program from localStorage
    const savedProgram = localStorage.getItem('breathBetterActiveProgram');
    let activeProgram = null;
    
    if (savedProgram) {
      activeProgram = JSON.parse(savedProgram);
      setActiveProgram(activeProgram);
    }
    
    // Update programs with active program data
    const updatedPrograms = predefinedPrograms.map(program => {
      if (activeProgram && program.id === activeProgram.id) {
        return {
          ...program,
          currentDay: activeProgram.currentDay,
          completed: activeProgram.completed
        };
      }
      return program;
    });
    
    setPrograms(updatedPrograms);
    
    // Check premium status
    setIsPremium(isPremiumActive());
  }, []);
  
  const startProgram = (program: Program) => {
    // Initialize program with day 1
    const activeProgram = {
      ...program,
      currentDay: 1,
      completed: false
    };
    
    // Save to localStorage
    localStorage.setItem('breathBetterActiveProgram', JSON.stringify(activeProgram));
    
    // Update state
    setActiveProgram(activeProgram);
    
    // Update programs list
    setPrograms(programs.map(p => 
      p.id === program.id ? activeProgram : p
    ));
    
    // Select the first pattern for day 1
    onSelectPattern(program.patterns[0]);
    
    // Notify parent component
    onStartProgram();
  };
  
  const continueProgram = () => {
    if (!activeProgram) return;
    
    // Select the appropriate pattern based on the day
    const patternIndex = (activeProgram.currentDay! - 1) % activeProgram.patterns.length;
    onSelectPattern(activeProgram.patterns[patternIndex]);
    
    // Notify parent component
    onStartProgram();
  };
  
  const _completeDay = () => {
    if (!activeProgram) return;
    
    // Use the function here or remove it if not needed
    console.log("Day completed");
    
    // Check if program is completed
    const isCompleted = activeProgram.currentDay! >= activeProgram.days;
    
    // Update active program
    const updatedProgram = {
      ...activeProgram,
      currentDay: isCompleted ? activeProgram.currentDay : activeProgram.currentDay! + 1,
      completed: isCompleted
    };
    
    // Save to localStorage
    localStorage.setItem('breathBetterActiveProgram', JSON.stringify(updatedProgram));
    
    // Update state
    setActiveProgram(updatedProgram);
    
    // Update programs list
    setPrograms(programs.map(p => 
      p.id === activeProgram.id ? updatedProgram : p
    ));
  };
  
  const resetProgram = (programId: string) => {
    // Remove from localStorage
    localStorage.removeItem('breathBetterActiveProgram');
    
    // Update state
    setActiveProgram(null);
    
    // Update programs list
    setPrograms(programs.map(p => 
      p.id === programId ? { ...p, currentDay: undefined, completed: undefined } : p
    ));
  };
  
  // Then render the icon based on the string identifier
  const renderIcon = (iconName: string) => {
    switch(iconName) {
      case 'moon':
        return <Moon className="w-5 h-5" />;
      case 'brain':
        return <Brain className="w-5 h-5" />;
      case 'zap':
        return <Zap className="w-5 h-5" />;
      case 'heart':
        return <Heart className="w-5 h-5" />;
      default:
        return <Moon className="w-5 h-5" />;
    }
  };
  
  if (!isPremium) {
    return (
      <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-lg p-4 text-center">
        <h3 className="text-lg font-medium text-amber-500 mb-2">Premium Feature</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Unlock personalized breathing programs designed for specific goals.
        </p>
        <a
          href="/premium"
          className="inline-block px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-600 text-white rounded-lg
                   hover:from-amber-500 hover:to-yellow-700 transition-all duration-300 text-sm"
        >
          Upgrade to Premium
        </a>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Personalized Programs</h3>
      
      {activeProgram && !activeProgram.completed && (
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-green-500/20 p-2 rounded-full">
                {renderIcon(activeProgram.icon as string)}
              </div>
              <div>
                <h4 className="font-medium">{activeProgram.name}</h4>
                <p className="text-xs text-slate-500">Day {activeProgram.currentDay} of {activeProgram.days}</p>
              </div>
            </div>
            
            <button
              onClick={continueProgram}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg
                       hover:bg-green-600 transition-all duration-300 text-sm"
            >
              <Play size={14} /> Continue
            </button>
          </div>
          
          <div className="w-full bg-white/10 rounded-full h-2 mb-1">
            <div 
              className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full"
              style={{ width: `${(activeProgram.currentDay! / activeProgram.days) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-xs text-slate-500">
            <span>Progress: {Math.round((activeProgram.currentDay! / activeProgram.days) * 100)}%</span>
            <button 
              onClick={() => resetProgram(activeProgram.id)}
              className="text-red-400 hover:text-red-300"
            >
              Reset
            </button>
          </div>
        </div>
      )}
      
      {activeProgram && activeProgram.completed && (
        <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-lg p-4 text-center">
          <h4 className="font-medium text-amber-500 mb-1">Program Completed!</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
            Congratulations on completing the {activeProgram.name} program!
          </p>
          <button
            onClick={() => resetProgram(activeProgram.id)}
            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-600 text-white rounded-lg
                     hover:from-amber-500 hover:to-yellow-700 transition-all duration-300 text-sm"
          >
            Start Again
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {programs.map(program => (
          <motion.div
            key={program.id}
            className={`bg-white/5 border border-white/10 rounded-lg p-4 cursor-pointer
                      ${showDetails === program.id ? 'ring-2 ring-amber-500' : ''}`}
            whileHover={{ y: -2, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
            onClick={() => setShowDetails(showDetails === program.id ? null : program.id)}
          >
            <div className="flex items-start gap-3">
              <div className="bg-amber-500/20 p-2 rounded-full">
                {renderIcon(program.icon as string)}
              </div>
              
              <div className="flex-1">
                <h4 className="font-medium">{program.name}</h4>
                <p className="text-xs text-slate-500">{program.days} days</p>
                
                {showDetails === program.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                    className="mt-3"
                  >
                    <p className="text-sm text-slate-400 mb-3">{program.description}</p>
                    
                    <div className="space-y-2 mb-3">
                      <h5 className="text-xs font-medium">Includes:</h5>
                      <ul className="text-xs text-slate-500 list-disc pl-4 space-y-1">
                        {program.patterns.map((pattern, index) => (
                          <li key={index}>{pattern.name}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {!activeProgram || activeProgram.id !== program.id || activeProgram.completed ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startProgram(program);
                        }}
                        className="w-full px-3 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-600 text-white rounded-lg
                                 hover:from-amber-500 hover:to-yellow-700 transition-all duration-300 text-sm"
                      >
                        Start Program
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          continueProgram();
                        }}
                        className="w-full px-3 py-1.5 bg-green-500 text-white rounded-lg
                                 hover:bg-green-600 transition-all duration-300 text-sm flex items-center justify-center gap-1"
                      >
                        <Play size={14} /> Continue Day {activeProgram.currentDay}
                      </button>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 