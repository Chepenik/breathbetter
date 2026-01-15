# decisions.md — Architecture Decision Records

## ADR-001: Dark Mode Default
**Date**: Inherited
**Status**: Accepted
**Context**: Breathing apps benefit from reduced visual stimulation
**Decision**: Default to dark theme, with light mode as user preference
**Consequence**: Better for evening use, matches meditative context

## ADR-002: localStorage for Premium
**Date**: Inherited
**Status**: Accepted
**Context**: Simple premium feature management without backend
**Decision**: Store premium status and sessions in localStorage
**Consequence**: No account needed, but data is device-specific and can be lost
**Trade-off**: Acceptable for MVP; consider sync solution for v2

## ADR-003: Framer Motion for Animations
**Date**: Inherited
**Status**: Accepted
**Context**: Breathing visualization requires smooth, interruptible animations
**Decision**: Use Framer Motion for all animations
**Consequence**: Larger bundle, but excellent animation control and React integration

## ADR-004: No External State Management
**Date**: Inherited
**Status**: Accepted
**Context**: App state is relatively simple (current pattern, phase, timer)
**Decision**: Use React useState/useEffect, no Redux/Zustand
**Consequence**: Less complexity, state lives in practice page component

---

## ADR-005: Focus on Accessibility First
**Date**: 2025-01-14
**Status**: Proposed
**Context**: Several accessibility gaps identified during audit
**Decision**: Prioritize focus states, keyboard navigation, screen reader support before visual polish
**Consequence**: May delay some visual improvements, but creates more inclusive product
