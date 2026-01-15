# Changelog

All notable changes to BreathBetter.

---

## [Unreleased]

### Added
- Documentation structure (human.md, progress.md, todo.md, decisions.md, tests.json)
- /docs directory with overview, UX guidelines, architecture docs
- Skip-to-content link for screen reader accessibility
- Global focus-visible states for all interactive elements
- `prefers-reduced-motion` media query support
- Proper aria-labels on interactive elements
- Loading skeleton for practice page (prevents content flash during premium check)

### Fixed
- Tailwind config typo: `compoenents` → `components`
- PatternSelector conflicting CSS classes (proper dark mode handling)
- Unused variables and dead code in premium/page.tsx
- Unused useRef import in EnhancedBreathingCircle
- Unused _completeDay function in PersonalizedPrograms
- Pattern selector using undefined CSS variable

### Changed
- SupportButton simplified (removed excessive animations for calmer UX)
- Navigation logo simplified (removed continuous animation, kept hover effects)
- SocialLinks hover effects reduced (scale 105 instead of 110)
- All transitions reduced to 200ms for snappier feel
- Home page: warmer headline, grounded copy, calmer CTA without excessive transforms
- Home page: redesigned benefits section with softer icons and friendlier copy
- Practice page: moved premium upsell below controls (less intrusive)
- Practice page: contextual helper text that changes based on playing state
- Stats dashboard: warm empty state with encouraging copy
- Pattern selector: mobile-friendly centered modal tooltip

### Security
- None

---

## [0.1.0] - Initial Release

### Added
- Box Breathing, 4-7-8, Spiral, Wim Hof, Triangle patterns
- Interactive breathing visualization
- Dark/light theme support
- Background ambient music
- Premium features: custom patterns, stats, visualizations
- Mobile responsive design

---

## Format

```
## [Version] - YYYY-MM-DD

### Added
New features

### Changed
Changes to existing functionality

### Deprecated
Features to be removed in future

### Removed
Removed features

### Fixed
Bug fixes

### Security
Security-related changes
```
