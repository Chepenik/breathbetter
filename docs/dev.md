# Development Guide

## Prerequisites
- Node.js 18.0.0+
- npm or yarn

## Setup
```bash
# Clone repository
git clone https://github.com/Chepenik/breathbetter.git
cd breathbetter

# Install dependencies
npm install

# Start development server (with Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with Turbopack |
| `npm run build` | Production build |
| `npm run build:prod` | Production build (ESLint disabled) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure
```
breathbetter/
├── app/                  # Next.js App Router pages
│   ├── page.tsx         # Home page
│   ├── layout.tsx       # Root layout
│   ├── practice/        # Main breathing practice
│   └── premium/         # Premium features page
├── components/          # React components
├── lib/                 # Utilities and data
│   ├── patterns.ts      # Breathing pattern definitions
│   ├── premium.ts       # Premium feature management
│   └── utils.ts         # Helper functions
├── public/              # Static assets
│   └── sounds/          # Audio files
├── types/               # TypeScript declarations
└── docs/                # Documentation
```

## Key Files

### Breathing Logic
- `lib/patterns.ts` — Pattern types and definitions
- `app/practice/page.tsx` — Timer logic, phase transitions

### Premium System
- `lib/premium.ts` — localStorage-based premium management
- `components/StatsDashboard.tsx` — Session tracking UI

### Visualizations
- `components/EnhancedBreathingCircle.tsx` — Main visualization switcher
- `components/ThreeDVisualization.tsx` — 3D premium visualization
- `components/BreathingCircle.tsx` — Basic circle visualization

## Environment Variables
Currently none required. All configuration is in code.

## Testing
No automated test suite currently. See `/docs/qa.md` for manual test checklist.

## Common Tasks

### Add a New Breathing Pattern
Edit `lib/patterns.ts`:
```typescript
export const patterns = [
  // ... existing patterns
  {
    name: "New Pattern",
    description: "Inhale 4s; Hold 4s; Exhale 4s",
    durations: { inhale: 4, hold: 4, exhale: 4, holdAfterExhale: 0 }
  }
];
```

### Test Premium Features
1. Navigate to `/premium`
2. Click "Activate Premium" (currently free)
3. Return to `/practice` to see premium tabs
