declare module 'next-themes/dist/types' {
  type Attribute = 'class' | 'data-theme'; // Example, adjust based on actual usage

  export interface ThemeProviderProps {
    attribute?: Attribute | Attribute[];
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    children?: React.ReactNode;
  }
} 