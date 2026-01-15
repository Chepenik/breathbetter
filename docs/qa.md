# QA Manual Test Checklist

## Pre-Release Checklist

### Core Breathing Flow
- [ ] Start breathing session with Box Breathing
- [ ] Verify circle expands on inhale
- [ ] Verify circle contracts on exhale
- [ ] Verify "Hold" phases work correctly
- [ ] Stop session and verify reset
- [ ] Test all 5 default patterns

### Pattern Selection
- [ ] Dropdown opens and shows all patterns
- [ ] Selecting pattern updates breathing durations
- [ ] "How to practice" tooltip opens
- [ ] Tooltip shows correct pattern description
- [ ] Tooltip closes on backdrop click
- [ ] Tooltip closes on "Close" button

### Audio
- [ ] Background music plays when session starts
- [ ] Mute button silences audio
- [ ] Unmute button restores audio
- [ ] Transition sounds play on phase change

### Premium Flow
- [ ] Navigate to /premium from practice page
- [ ] Activate premium (currently free)
- [ ] Return to practice page
- [ ] Verify tabs appear (Practice, Programs, Custom, Stats)
- [ ] Deactivate premium
- [ ] Verify tabs disappear

### Visualizations (Premium)
- [ ] Default circle visualization works
- [ ] Mandala visualization renders
- [ ] 3D visualization renders
- [ ] Color picker changes visualization colors

### Stats Dashboard (Premium)
- [ ] Shows "No sessions" when empty
- [ ] Records session after completing practice
- [ ] Total sessions count updates
- [ ] Streak calculation works
- [ ] Total time accumulates

### Theme Toggle
- [ ] Toggle switches between dark/light
- [ ] All text remains readable in both modes
- [ ] Preference persists on refresh

### Navigation
- [ ] Logo links to home
- [ ] Can navigate between all pages
- [ ] Back button works correctly

### Responsive Design
- [ ] Mobile (375px): All content visible
- [ ] Tablet (768px): Layout adjusts appropriately
- [ ] Desktop (1024px+): Full layout displays

### Accessibility
- [ ] Tab through all interactive elements
- [ ] Focus indicators visible
- [ ] Screen reader announces page content
- [ ] Buttons have accessible names

---

## Browser Testing

| Browser | Status | Notes |
|---------|--------|-------|
| Chrome (latest) | | |
| Safari (latest) | | |
| Firefox (latest) | | |
| Edge (latest) | | |
| iOS Safari | | |
| Chrome Android | | |

---

## Known Issues
See `/docs/bug-hunt.md` for tracked bugs.
