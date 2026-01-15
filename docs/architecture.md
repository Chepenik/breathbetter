# Architecture Overview

## High-Level Structure

```
┌─────────────────────────────────────────────────────────────┐
│                         Next.js App                          │
├─────────────────────────────────────────────────────────────┤
│  app/                                                        │
│  ├── layout.tsx    (ThemeProvider, Navigation)              │
│  ├── page.tsx      (Home - marketing)                       │
│  ├── practice/     (Core breathing experience)              │
│  └── premium/      (Premium features showcase)              │
├─────────────────────────────────────────────────────────────┤
│  components/                                                 │
│  ├── EnhancedBreathingCircle (visualization router)         │
│  ├── PatternSelector         (dropdown + tooltip)           │
│  ├── StatsDashboard          (premium: session history)     │
│  └── ...                                                    │
├─────────────────────────────────────────────────────────────┤
│  lib/                                                        │
│  ├── patterns.ts   (breathing pattern data)                 │
│  ├── premium.ts    (localStorage premium management)        │
│  └── utils.ts      (shared utilities)                       │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Breathing Session
```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ User clicks │────▶│ Timer starts │────▶│ Phase updates   │
│ Start       │     │ (useEffect)  │     │ (100ms interval)│
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                    ┌──────────────┐     ┌────────▼────────┐
                    │ Animation    │◀────│ EnhancedCircle  │
                    │ (Framer)     │     │ receives props  │
                    └──────────────┘     └─────────────────┘
```

### Premium State
```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│ User visits │────▶│ useEffect    │────▶│ isPremiumActive │
│ /practice   │     │ checks       │     │ reads localStorage│
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                    ┌──────────────┐     ┌────────▼────────┐
                    │ Render       │◀────│ isPremium state │
                    │ premium UI   │     │ set in component│
                    └──────────────┘     └─────────────────┘
```

## Key Components

### PracticePage (`app/practice/page.tsx`)
The heart of the app. Manages:
- Current pattern selection
- Timer state (isPlaying, phase, timeRemaining)
- Sequence patterns (spiral breathing with decreasing durations)
- Premium feature conditionals

### EnhancedBreathingCircle
Visualization router that renders:
- `"circle"` — Default animated circle
- `"mandala"` — Layered rotating rings (premium)
- `"3d"` — ThreeDVisualization with cube (premium)

### Pattern Types
```typescript
// Standard: fixed durations
type StandardPattern = {
  name: string;
  description: string;
  durations: { inhale, hold, exhale, holdAfterExhale }
}

// Sequence: array of decreasing durations
type SequencePattern = {
  name: string;
  description: string;
  sequence: number[];  // e.g., [13, 8, 5, 3, 2, 1]
  durations: { holdAfterExhale }
}
```

## State Management

No external state library. State lives in:
- **Component state** (useState): UI state, form inputs
- **localStorage**: Premium status, sessions, custom patterns
- **URL**: Page navigation only

## Styling Architecture

- **TailwindCSS**: Utility classes for layout, spacing, colors
- **CSS Variables**: Theme colors in `globals.css`
- **Framer Motion**: All animations
- **Dark mode**: Class-based via `next-themes`

## Audio
Background music and transition sounds in `public/sounds/`.
Managed by `BackgroundMusic` component, controlled by isMuted state.
