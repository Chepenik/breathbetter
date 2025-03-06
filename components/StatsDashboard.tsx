"use client";

import { useState, useEffect } from "react";
import { BarChart, Calendar, Clock, Download, Award } from "lucide-react";
import { isPremiumActive } from "@/lib/premium";

interface BreathingSession {
  date: string;
  pattern: string;
  duration: number; // in seconds
  completed: boolean;
}

export function StatsDashboard() {
  const [isPremium, setIsPremium] = useState(false);
  const [sessions, setSessions] = useState<BreathingSession[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [favoritePattern, setFavoritePattern] = useState("");
  
  // Check premium status and load stats
  useEffect(() => {
    const premium = isPremiumActive();
    setIsPremium(premium);
    
    if (premium) {
      // Load sessions from localStorage
      const savedSessions = localStorage.getItem('breathBetterSessions');
      if (savedSessions) {
        const parsedSessions = JSON.parse(savedSessions) as BreathingSession[];
        setSessions(parsedSessions);
        
        // Calculate stats
        calculateStats(parsedSessions);
      }
    }
  }, []);
  
  const calculateStats = (sessions: BreathingSession[]) => {
    // Sort sessions by date (newest first)
    const sortedSessions = [...sessions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    // Calculate total time
    const total = sortedSessions.reduce((sum, session) => sum + session.duration, 0);
    setTotalTime(total);
    
    // Calculate current streak
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Check if there's a session today
    const todaySession = sortedSessions.find(session => {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === currentDate.getTime();
    });
    
    if (todaySession) {
      streak = 1;
      
      // Check consecutive days before today
      let checkDate = new Date(currentDate);
      let keepChecking = true;
      
      while (keepChecking) {
        checkDate.setDate(checkDate.getDate() - 1);
        
        const sessionOnDate = sortedSessions.find(session => {
          const sessionDate = new Date(session.date);
          sessionDate.setHours(0, 0, 0, 0);
          return sessionDate.getTime() === checkDate.getTime();
        });
        
        if (sessionOnDate) {
          streak++;
        } else {
          keepChecking = false;
        }
      }
    }
    
    setCurrentStreak(streak);
    
    // Find favorite pattern
    const patternCounts: Record<string, number> = {};
    sortedSessions.forEach(session => {
      patternCounts[session.pattern] = (patternCounts[session.pattern] || 0) + 1;
    });
    
    let maxCount = 0;
    let favorite = "";
    
    Object.entries(patternCounts).forEach(([pattern, count]) => {
      if (count > maxCount) {
        maxCount = count;
        favorite = pattern;
      }
    });
    
    setFavoritePattern(favorite);
  };
  
  const exportSessionsCSV = () => {
    if (sessions.length === 0) return;
    
    // Create CSV content
    const headers = ["Date", "Pattern", "Duration (seconds)", "Completed"];
    const csvRows = [headers.join(",")];
    
    sessions.forEach(session => {
      const row = [
        session.date,
        `"${session.pattern}"`, // Quote pattern name to handle commas
        session.duration,
        session.completed ? "Yes" : "No"
      ];
      csvRows.push(row.join(","));
    });
    
    const csvContent = csvRows.join("\n");
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "breath-better-sessions.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (!isPremium) {
    return (
      <div className="bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20 rounded-lg p-4 text-center">
        <h3 className="text-lg font-medium text-amber-500 mb-2">Premium Feature</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
          Track your breathing practice with detailed statistics and insights.
        </p>
        <a
          href="/premium"
          className="inline-block px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-600 text-white text-sm rounded-lg
                   hover:from-amber-500 hover:to-yellow-700 transition-all duration-300"
        >
          Unlock Premium
        </a>
      </div>
    );
  }
  
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Your Breathing Stats</h3>
        
        <button
          onClick={exportSessionsCSV}
          disabled={sessions.length === 0}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md
                    ${sessions.length === 0 
                      ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' 
                      : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'}`}
        >
          <Download size={14} /> Export CSV
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard 
          icon={<Calendar className="w-5 h-5 text-amber-400" />}
          value={sessions.length.toString()}
          label="Total Sessions"
        />
        
        <StatCard 
          icon={<Award className="w-5 h-5 text-amber-400" />}
          value={currentStreak.toString()}
          label="Day Streak"
        />
        
        <StatCard 
          icon={<Clock className="w-5 h-5 text-amber-400" />}
          value={formatTime(totalTime)}
          label="Total Time"
        />
        
        <StatCard 
          icon={<BarChart className="w-5 h-5 text-amber-400" />}
          value={favoritePattern || "None"}
          label="Favorite Pattern"
        />
      </div>
      
      {sessions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-2">Date</th>
                <th className="text-left py-2 px-2">Pattern</th>
                <th className="text-left py-2 px-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              {sessions.slice(0, 5).map((session, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="py-2 px-2">{formatDate(session.date)}</td>
                  <td className="py-2 px-2">{session.pattern}</td>
                  <td className="py-2 px-2">{formatTime(session.duration)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {sessions.length > 5 && (
            <div className="text-center text-xs text-slate-500 mt-2">
              Showing 5 of {sessions.length} sessions. Export CSV for full history.
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6 text-slate-500">
          No sessions recorded yet. Start practicing to build your stats!
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col items-center justify-center">
      <div className="mb-1">{icon}</div>
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
} 