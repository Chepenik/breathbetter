# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack (http://localhost:3000)
npm run build        # Production build
npm run build:prod   # Production build with ESLint disabled
npm run lint         # Run ESLint
npm run start        # Start production server
```

## Architecture

This is a Next.js 15 breathing exercise application using the App Router with React 19, TypeScript, TailwindCSS, and Framer Motion for animations.

### Key Directories

- `app/` - Next.js App Router pages (home, `/practice`, `/premium`)
- `components/` - React components
- `lib/` - Shared utilities and data (`patterns.ts`, `premium.ts`, `utils.ts`)
- `types/` - TypeScript type declarations

### Core Concepts

**Breathing Patterns** (`lib/patterns.ts`):
- Two pattern types: `StandardPattern` (fixed durations for inhale/hold/exhale/holdAfterExhale) and `SequencePattern` (array of decreasing durations like Spiral Breathing)
- The `Phase` type represents the current breathing phase: `"inhale" | "hold" | "exhale" | "holdAfterExhale"`

**Visualization System**:
- `EnhancedBreathingCircle` is the main visualization component that switches between three modes: `"circle"`, `"mandala"`, and `"3d"`
- The `"3d"` mode renders `ThreeDVisualization` which uses Framer Motion for a 3D cube effect with particles
- Animations are driven by the breathing phase and `timeRemaining` prop

**Premium Features** (`lib/premium.ts`):
- Premium status stored in localStorage with expiry date
- Premium unlocks: custom pattern creator, personalized programs, stats dashboard, visualization settings
- Check with `isPremiumActive()`, activate with `activatePremium(code)`

**Practice Page Flow** (`app/practice/page.tsx`):
- Main breathing timer runs in a `useEffect` with 100ms intervals
- State machine transitions between phases based on pattern durations
- Sessions recorded to localStorage for premium users

### Path Aliases

Uses `@/*` to reference files from project root (e.g., `@/components/Navigation`, `@/lib/patterns`).
