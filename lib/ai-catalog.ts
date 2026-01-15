import { createCatalog } from '@json-render/core';
import { z } from 'zod';

// Define the pattern names that match our existing patterns
const PatternNameSchema = z.enum([
  'Box Breathing',
  '4-7-8 Breathing',
  'Spiral Breathing',
  'Wim Hof Breath',
  'Triangle Breath',
  'Custom'
]);

// Action schemas for the catalog
const ActionSchema = z.discriminatedUnion('name', [
  z.object({
    name: z.literal('start_session'),
    params: z.object({
      patternName: z.string(),
      duration: z.number().optional(),
    }),
  }),
  z.object({
    name: z.literal('save_program'),
    params: z.object({
      programId: z.string(),
    }),
  }),
]);

export const breathingCatalog = createCatalog({
  components: {
    // Session Builder Components
    SessionIntro: {
      props: z.object({
        title: z.string().describe('A catchy title for the session'),
        description: z.string().describe('Brief description of what this session will help with'),
        estimatedMinutes: z.number().describe('Total session duration in minutes'),
      }),
    },
    BreathingExercise: {
      props: z.object({
        patternName: PatternNameSchema.describe('Which breathing pattern to use'),
        duration: z.number().describe('How long to do this exercise in minutes'),
        guidance: z.string().describe('Personalized guidance text for this exercise'),
      }),
    },
    Guidance: {
      props: z.object({
        text: z.string().describe('Guidance or motivational text'),
        timing: z.enum(['before', 'during', 'after']).describe('When to show this guidance'),
      }),
    },
    Tip: {
      props: z.object({
        content: z.string().describe('A helpful tip for the user'),
      }),
    },
    StartSessionButton: {
      props: z.object({
        label: z.string().describe('Button text'),
        patternName: PatternNameSchema.describe('Pattern to start'),
      }),
    },

    // Program Generator Components
    Program: {
      props: z.object({
        id: z.string().describe('Unique ID for this program'),
        name: z.string().describe('Program name'),
        goal: z.string().describe('What this program helps achieve'),
        totalDays: z.number().describe('Total number of days in the program'),
      }),
      hasChildren: true,
    },
    Day: {
      props: z.object({
        dayNumber: z.number().describe('Which day of the program (1-indexed)'),
        focus: z.string().describe('Theme or focus for this day'),
        patternName: PatternNameSchema.describe('Breathing pattern for this day'),
        duration: z.number().describe('Session duration in minutes'),
        tip: z.string().optional().describe('Optional tip for this day'),
      }),
    },
    Milestone: {
      props: z.object({
        afterDay: z.number().describe('Show this milestone after completing this day number'),
        message: z.string().describe('Celebratory message'),
      }),
    },
    SaveProgramButton: {
      props: z.object({
        label: z.string().describe('Button text'),
        programId: z.string().describe('ID of the program to save'),
      }),
    },

    // Custom Pattern Components
    CustomPattern: {
      props: z.object({
        name: z.string().describe('Name for this custom pattern'),
        description: z.string().describe('Description of the pattern'),
        inhale: z.number().describe('Inhale duration in seconds'),
        hold: z.number().describe('Hold duration in seconds'),
        exhale: z.number().describe('Exhale duration in seconds'),
        holdAfterExhale: z.number().describe('Hold after exhale duration in seconds'),
      }),
    },
  },
  actions: {
    start_session: {
      description: 'Start a breathing session with the specified pattern',
    },
    save_program: {
      description: 'Save the generated program to the user\'s programs',
    },
    save_pattern: {
      description: 'Save a custom pattern to the user\'s patterns',
    },
  },
});

// Export the catalog schema as a string for the AI prompt
export function getCatalogPrompt(): string {
  return `You are an AI breathing coach. Generate UI using ONLY these components:

COMPONENTS:
- SessionIntro: { title: string, description: string, estimatedMinutes: number }
- BreathingExercise: { patternName: "Box Breathing" | "4-7-8 Breathing" | "Spiral Breathing" | "Wim Hof Breath" | "Triangle Breath" | "Custom", duration: number (minutes), guidance: string }
- Guidance: { text: string, timing: "before" | "during" | "after" }
- Tip: { content: string }
- StartSessionButton: { label: string, patternName: string }
- Program: { id: string, name: string, goal: string, totalDays: number } (can contain Day and Milestone children)
- Day: { dayNumber: number, focus: string, patternName: string, duration: number (minutes), tip?: string }
- Milestone: { afterDay: number, message: string }
- SaveProgramButton: { label: string, programId: string }
- CustomPattern: { name: string, description: string, inhale: number (seconds), hold: number (seconds), exhale: number (seconds), holdAfterExhale: number (seconds) }

PATTERN RECOMMENDATIONS:
- Box Breathing (4-4-4-4): Best for focus, grounding, general stress relief
- 4-7-8 Breathing: Best for sleep, deep relaxation, anxiety
- Spiral Breathing: Best for meditation, altered states, deep work
- Wim Hof Breath: Best for energy, alertness, cold exposure prep
- Triangle Breath (5-5-5): Best for beginners, balance, gentle calming

OUTPUT FORMAT:
Return a JSON array of components. Each component has { type: string, props: object, children?: array }.

Example for a quick session:
[
  { "type": "SessionIntro", "props": { "title": "Quick Calm", "description": "A 3-minute reset for your busy day", "estimatedMinutes": 3 }},
  { "type": "BreathingExercise", "props": { "patternName": "Box Breathing", "duration": 3, "guidance": "Focus on the steady rhythm" }},
  { "type": "Tip", "props": { "content": "Try this before important meetings" }},
  { "type": "StartSessionButton", "props": { "label": "Start Breathing", "patternName": "Box Breathing" }}
]

Example for a program:
[
  { "type": "Program", "props": { "id": "sleep-week", "name": "Better Sleep in 7 Days", "goal": "Improve sleep quality", "totalDays": 7 }, "children": [
    { "type": "Day", "props": { "dayNumber": 1, "focus": "Introduction", "patternName": "4-7-8 Breathing", "duration": 5, "tip": "Practice 30 mins before bed" }},
    { "type": "Milestone", "props": { "afterDay": 3, "message": "Halfway there! You're building a great habit." }},
    { "type": "Day", "props": { "dayNumber": 7, "focus": "Mastery", "patternName": "4-7-8 Breathing", "duration": 10 }}
  ]},
  { "type": "SaveProgramButton", "props": { "label": "Save This Program", "programId": "sleep-week" }}
]`;
}

export type CatalogComponentType =
  | 'SessionIntro'
  | 'BreathingExercise'
  | 'Guidance'
  | 'Tip'
  | 'StartSessionButton'
  | 'Program'
  | 'Day'
  | 'Milestone'
  | 'SaveProgramButton'
  | 'CustomPattern';

export interface AIComponent {
  type: CatalogComponentType;
  props: Record<string, unknown>;
  children?: AIComponent[];
}
