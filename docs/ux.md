# UX Rules & Accessibility

## Design Principles

### Calm Over Clever
- Prefer subtle over flashy
- Animations should aid focus, not distract
- Every element earns its place

### Clarity Over Density
- Generous whitespace
- Clear hierarchy
- One primary action per view

### Trust Over Engagement
- No dark patterns
- Transparent about premium/free
- Respect user attention

## Accessibility Checklist

### Keyboard Navigation
- [ ] All interactive elements focusable via Tab
- [ ] Focus order follows visual hierarchy
- [ ] Visible focus indicators on all elements
- [ ] Escape closes modals/tooltips
- [ ] Enter/Space activates buttons

### Screen Readers
- [ ] All images have meaningful alt text
- [ ] Form inputs have associated labels
- [ ] Buttons have descriptive text or aria-label
- [ ] Phase changes announced via aria-live region
- [ ] Skip-to-content link at page start

### Visual
- [ ] Color contrast meets WCAG AA (4.5:1 for text)
- [ ] Information not conveyed by color alone
- [ ] Text resizable to 200% without loss
- [ ] No flashing content >3 times/second

### Motor
- [ ] Touch targets minimum 44x44px
- [ ] Adequate spacing between interactive elements
- [ ] No time-limited interactions (except breathing timer itself)

## Component Patterns

### Buttons
```
- Clear, high-contrast text
- Visible hover state
- Visible focus-visible state (ring)
- Active/pressed state
- Disabled state when appropriate
```

### Modals/Tooltips
```
- Backdrop click to dismiss
- Focus trapped within modal
- Escape key to close
- Return focus to trigger on close
```

### Forms
```
- Labels above or beside inputs
- Error states with descriptive messages
- Success confirmation
```

## Animation Guidelines

| Context | Recommended | Avoid |
|---------|------------|-------|
| Breathing circle | Smooth, continuous | Jarring transitions |
| UI feedback | Quick (200-300ms) | Slow, distracting |
| Hover effects | Subtle scale/glow | Excessive movement |
| Loading states | Calm spinner/pulse | Aggressive animation |
