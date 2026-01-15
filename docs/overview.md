# BreathBetter Overview

## What It Is
BreathBetter is a mindful breathing application that guides users through various breathing patterns to reduce stress, improve focus, and enhance well-being.

## How It Works

### Breathing Patterns
The app offers several pre-built breathing patterns:

| Pattern | Rhythm | Purpose |
|---------|--------|---------|
| Box Breathing | 4-4-4-4 | Balance, calm |
| 4-7-8 Breathing | 4-7-8 | Sleep, relaxation |
| Spiral Breathing | 13→8→5→3→2→1 | Deep calm, Fibonacci-inspired |
| Wim Hof | 2-0-2-0 (30 breaths) | Energy, alertness |
| Triangle Breath | 5-5-5 | Simple focus |

### Core Flow
1. User selects a breathing pattern
2. Clicks "Start" to begin the guided session
3. Visual circle expands/contracts with breathing phases
4. Audio cue marks phase transitions
5. User clicks "Stop" when finished

### Premium Features
- **Custom Patterns**: Create personalized breathing rhythms
- **Statistics Dashboard**: Track sessions, streaks, total time
- **Personalized Programs**: Multi-day programs for specific goals
- **Advanced Visualizations**: 3D geometric animations, mandalas, custom colors

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **React**: 19
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **State**: React hooks (no external state management)
- **Storage**: localStorage for preferences and premium data
