# UI Audit — Issues & Improvements

## Audit Date: 2025-01-14

---

## Critical Issues

### 1. Missing Focus States
**Location**: Most buttons and interactive elements
**Issue**: Keyboard users cannot see what element is focused
**Impact**: Accessibility blocker
**Fix**: Add `focus-visible:ring-2 focus-visible:ring-offset-2` to all interactive elements

### 2. Tailwind Config Typo
**Location**: `tailwind.config.ts` line 7
**Issue**: `"./compoenents/**/*.{js,ts,jsx,tsx,mdx}"` is misspelled
**Impact**: Components may not be picked up by Tailwind purge
**Fix**: Change to `"./components/..."`

### 3. Conflicting CSS Classes
**Location**: `PatternSelector.tsx` line 38
**Issue**: `className="bg-gray-800 text-white dark:bg-gray-800 dark:text-white bg-slate-200 text-slate-800"`
**Impact**: Unpredictable styling, light mode broken
**Fix**: Remove conflicting classes, use proper dark mode variants

---

## High Priority Issues

### 4. Support Button Over-Animation
**Location**: `SupportButton.tsx`
**Issue**: Multiple simultaneous animations (pulse, rotate, particles) compete for attention
**Impact**: Distracts from breathing exercise; feels anxious, not calm
**Fix**: Reduce to single subtle hover effect; remove particles

### 5. No Skip-to-Content Link
**Location**: `layout.tsx`
**Issue**: Screen reader users must tab through nav to reach content
**Impact**: Accessibility issue
**Fix**: Add visually hidden skip link at start of body

### 6. Premium Upsell Interrupts Flow
**Location**: `practice/page.tsx`
**Issue**: Premium CTA appears before breathing circle when not premium
**Impact**: Users came to breathe, not to buy; breaks calm
**Fix**: Move upsell below breathing circle or to sidebar/footer

---

## Medium Priority Issues

### 7. Tooltip Mobile Overflow
**Location**: `PatternSelector.tsx`
**Issue**: Tooltip positioned absolutely, may overflow viewport on small screens
**Impact**: Content cut off or inaccessible
**Fix**: Add max-width, consider repositioning or bottom sheet on mobile

### 8. No Loading State
**Location**: `practice/page.tsx`
**Issue**: Premium check happens in useEffect, causing flash
**Impact**: Brief layout shift, minor jank
**Fix**: Add loading skeleton or suspense boundary

### 9. Navigation Logo Animation
**Location**: `Navigation.tsx`
**Issue**: Constant subtle animation (every 5s) even when not interacting
**Impact**: Subtle distraction, unnecessary motion
**Fix**: Remove or reduce continuous animation; keep hover effects only

---

## Low Priority / Polish

### 10. Stats Dashboard Empty State
**Location**: `StatsDashboard.tsx`
**Issue**: "No sessions recorded yet" is plain text
**Impact**: Missed opportunity for gentle encouragement
**Fix**: Add friendly illustration or motivational message

### 11. Color Contrast in Light Mode
**Location**: Various
**Issue**: Some text on light backgrounds may not meet WCAG AA
**Impact**: Accessibility concern
**Fix**: Audit all text/background combinations

---

## Improvements Made

| Date | Issue | Fix Applied |
|------|-------|-------------|
| 2025-01-14 | Missing Focus States | Added global focus-visible styles in globals.css |
| 2025-01-14 | Tailwind Config Typo | Fixed `compoenents` → `components` |
| 2025-01-14 | Conflicting CSS Classes | Fixed PatternSelector option styling |
| 2025-01-14 | Support Button Over-Animation | Simplified to single subtle hover effect |
| 2025-01-14 | No Skip-to-Content Link | Added skip link in layout.tsx |
| 2025-01-14 | Navigation Logo Animation | Removed continuous animation, kept hover |
| 2025-01-14 | No Reduced Motion Support | Added prefers-reduced-motion media query |
