export type Phase = "inhale" | "hold" | "exhale" | "holdAfterExhale";

// Define a common base pattern type
export type BasePattern = {
  name: string;
  description: string;
};

// Define two separate pattern types
export type StandardPattern = BasePattern & {
  durations: {
    inhale: number;
    hold: number;
    exhale: number;
    holdAfterExhale: number;
  };
  sequence?: undefined;
};

export type SequencePattern = BasePattern & {
  sequence: number[];
  durations: {
    holdAfterExhale: number;
    inhale?: undefined;
    hold?: undefined;
    exhale?: undefined;
  };
};

// Union type for Pattern
export type Pattern = StandardPattern | SequencePattern;

export const patterns = [
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
    name: "4-7-8 Breathing",
    description: "Inhale for 4 seconds; Hold for 7 seconds; Exhale for 8 seconds",
    durations: {
      inhale: 4,
      hold: 7,
      exhale: 8,
      holdAfterExhale: 0
    }
  },
  {
    name: "Spiral Breathing",
    description: "Start with 13-second breaths, then gradually decrease to 8, 5, 3, 2, and 1 second; Hold for 13 seconds at the end of the cycle; Repeat",
    sequence: [13, 8, 5, 3, 2, 1],
    durations: {
      holdAfterExhale: 13
    }
  },
  {
    name: "Wim Hof Breath",
    description:
      "30 deep breaths, hold after last exhale (30-60s), inhale deeply, hold for 15s, repeat 3-4 rounds",
    durations: { inhale: 2, hold: 0, exhale: 2, holdAfterExhale: 0 },
  },
  {
    name: "Triangle Breath",
    description: "Inhale 5s, Hold 5s, Exhale 5s",
    durations: { inhale: 5, hold: 5, exhale: 5, holdAfterExhale: 0 },
  },
];
