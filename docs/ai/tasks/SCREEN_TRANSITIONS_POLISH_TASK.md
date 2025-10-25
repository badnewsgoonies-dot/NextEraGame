# Screen Transitions & Visual Polish Task

**Status**: Ready for Graphics AI  
**Priority**: Medium (Polish)  
**Estimated Scope**: 3-4 phases of visual improvements

---

## Overview

Add visual polish through screen transitions, character walk animations, and standardized viewport dimensions. Goals:
1. **No scrolling** - Fix viewport to standard game dimensions
2. **Screen transitions** - Fade/slide animations between screens
3. **Character animations** - Units walk into position (starter select), Isaac walks to opponent choice
4. **Consistent visual flow** - Professional feel throughout game loop

---

## Current State Assessment

### Viewport Issues
- All screens use `min-h-screen` (allows scrolling)
- No fixed game window dimensions
- Inconsistent padding/spacing across screens
- Mobile-first responsive design (not fixed canvas)

**Affected Files:**
- All 11 screen components use `min-h-screen`
- `index.html` has viewport meta but no size constraints
- `App.tsx` has no wrapper/container constraints

### Existing Animations
**Already Implemented:**
```css
/* src/styles/index.css has these animations: */
- fadeIn (0.3s) - opacity + scale
- shake (0.3s) - damage feedback
- damage-float (1s) - battle damage numbers
- battle-glow/enemy-glow (1.5s) - combat highlighting
- slide-in-up (0.6s) - opponent cards
- sprite-idle (3s) - breathing animation
- pulse-slow (3s) - title effect
```

**Missing:**
- Screen-to-screen transitions
- Character walk animations
- Entry/exit animations for UI elements
- Interactive sprite movements (Isaac walking to selection)

---

## Phase 1: Fixed Viewport & Standard Dimensions

### Goal
Eliminate all scrolling by establishing fixed game canvas dimensions.

### Recommended Dimensions
**Option A: 16:9 Standard (Recommended)**
- 1280x720px (HD-ready, scales well)
- Fixed aspect ratio, centered on screen
- Letterbox on larger displays

**Option B: Golden Sun Style**
- 960x640px (3:2 ratio, closer to GBA 3:2)
- More authentic retro feel
- Smaller canvas, easier for sprites

**Implementation Strategy:**

#### 1.1 Create Game Container Component
```tsx
// src/components/GameContainer.tsx
export function GameContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div 
        className="relative bg-gray-900 overflow-hidden"
        style={{ 
          width: '1280px', 
          height: '720px',
          maxWidth: '100vw',
          maxHeight: '100vh'
        }}
      >
        {children}
      </div>
    </div>
  );
}
```

#### 1.2 Wrap App.tsx
```tsx
// In App.tsx render
return (
  <GameContainer>
    {/* All screen components */}
  </GameContainer>
);
```

#### 1.3 Update All Screen Components
Replace `min-h-screen` with `h-full w-full` in:
- MainMenuScreen.tsx
- StarterSelectScreen.tsx
- OpponentSelectScreen.tsx
- GemSelectScreen.tsx
- BattleScreen.tsx
- RewardsScreen.tsx
- RecruitScreen.tsx
- EquipmentScreen.tsx
- InventoryScreen.tsx
- RosterManagementScreen.tsx
- SettingsScreen.tsx

#### 1.4 Adjust Padding/Spacing
- Use `p-4` or `p-6` instead of `p-8` (smaller viewport)
- Scale font sizes down 10-20% if needed
- Test all screens fit without scrolling

### Acceptance Criteria
- [ ] No scrolling on any screen at 1280x720
- [ ] Game canvas centered on larger displays
- [ ] Responsive scaling on smaller displays (mobile)
- [ ] All UI elements visible without overflow

---

## Phase 2: Screen Transition System

### Goal
Add smooth transitions when changing screens (fade, slide, or crossfade).

### 2.1 Create Transition Component
```tsx
// src/components/ScreenTransition.tsx
import { useState, useEffect } from 'react';

type TransitionType = 'fade' | 'slide-left' | 'slide-right' | 'crossfade';

interface ScreenTransitionProps {
  children: React.ReactNode;
  screenKey: string; // Changes when screen changes
  type?: TransitionType;
  duration?: number; // milliseconds
}

export function ScreenTransition({ 
  children, 
  screenKey,
  type = 'fade',
  duration = 300 
}: ScreenTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayedChildren, setDisplayedChildren] = useState(children);

  useEffect(() => {
    setIsTransitioning(true);
    
    const timer = setTimeout(() => {
      setDisplayedChildren(children);
      setIsTransitioning(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [screenKey, children, duration]);

  const transitionClasses = {
    fade: isTransitioning ? 'opacity-0' : 'opacity-100',
    'slide-left': isTransitioning ? 'translate-x-full' : 'translate-x-0',
    'slide-right': isTransitioning ? '-translate-x-full' : 'translate-x-0',
    crossfade: isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
  };

  return (
    <div 
      className={`transition-all duration-${duration} ${transitionClasses[type]}`}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {displayedChildren}
    </div>
  );
}
```

### 2.2 Add Transition Animations to index.css
```css
/* Screen transition utilities */
@keyframes screen-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes screen-slide-left {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes screen-slide-right {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.animate-screen-enter {
  animation: screen-fade-in 0.4s ease-out;
}

.animate-screen-slide-left {
  animation: screen-slide-left 0.4s ease-out;
}

.animate-screen-slide-right {
  animation: screen-slide-right 0.4s ease-out;
}
```

### 2.3 Integrate into App.tsx
```tsx
// Wrap screen rendering with transition
<ScreenTransition screenKey={currentScreen} type="fade">
  {currentScreen === 'menu' && <MainMenuScreen ... />}
  {currentScreen === 'starter_select' && <StarterSelectScreen ... />}
  {/* etc */}
</ScreenTransition>
```

### 2.4 Add Entry Animations to Individual Screens
For screens with important elements (OpponentCard, UnitCard):
```tsx
// Add staggered entry animations
<div className="animate-screen-enter" style={{ animationDelay: '0ms' }}>
  {/* First card */}
</div>
<div className="animate-screen-enter" style={{ animationDelay: '100ms' }}>
  {/* Second card */}
</div>
```

### Acceptance Criteria
- [ ] Smooth fade transitions between all screens (300-400ms)
- [ ] No jarring instant screen changes
- [ ] Staggered card entry on StarterSelect (12 cards)
- [ ] Staggered card entry on OpponentSelect (3 cards)
- [ ] Respects `prefers-reduced-motion` (instant transitions)

---

## Phase 3: Character Walk Animations - Starter Select

### Goal
When player selects a starter unit, that unit "walks out" from the side and into a formation position.

### 3.1 Create Formation Positions
```tsx
// src/components/StarterSelectScreen.tsx
const FORMATION_POSITIONS = [
  { x: 200, y: 500 }, // Position 1 (back-left)
  { x: 350, y: 500 }, // Position 2 (back-right)
  { x: 200, y: 580 }, // Position 3 (front-left)
  { x: 350, y: 580 }, // Position 4 (front-right)
];
```

### 3.2 Add Selected Units Display Area
Below the grid of 12 cards, add a "Your Team" section showing selected units in formation:
```tsx
{/* Selected Team Formation */}
<div className="relative h-32 mt-8 border-2 border-blue-500 rounded">
  <h3 className="text-white text-center mb-2">Your Team</h3>
  {selectedUnitsArray.map((unit, index) => (
    <AnimatedSprite
      key={unit.id}
      src={`/sprites/party/${unit.sprite}.png`}
      startX={-50} // Start off-screen left
      endX={FORMATION_POSITIONS[index].x}
      startY={FORMATION_POSITIONS[index].y}
      endY={FORMATION_POSITIONS[index].y}
      duration={800}
    />
  ))}
</div>
```

### 3.3 Create AnimatedSprite Component
```tsx
// src/components/AnimatedSprite.tsx
import { useState, useEffect } from 'react';

interface AnimatedSpriteProps {
  src: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number; // ms
}

export function AnimatedSprite({
  src, startX, startY, endX, endY, duration
}: AnimatedSpriteProps) {
  const [currentX, setCurrentX] = useState(startX);
  const [currentY, setCurrentY] = useState(startY);

  useEffect(() => {
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      setCurrentX(startX + (endX - startX) * eased);
      setCurrentY(startY + (endY - startY) * eased);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [startX, startY, endX, endY, duration]);

  return (
    <img
      src={src}
      alt="Unit sprite"
      className="absolute pixel-art sprite-idle"
      style={{
        left: `${currentX}px`,
        top: `${currentY}px`,
        width: '48px',
        height: '48px',
      }}
    />
  );
}
```

### 3.4 Integration Flow
1. Player clicks unit card → unit added to selection
2. AnimatedSprite appears, walks from off-screen to formation position
3. Reaches position → idle breathing animation starts
4. Player can deselect → sprite walks back off-screen (reverse animation)

### Acceptance Criteria
- [ ] Selected units walk from left edge to formation positions
- [ ] Walk animation takes ~800ms with ease-out
- [ ] Units reach positions and begin idle animation
- [ ] Deselecting a unit makes it walk back off-screen
- [ ] All 4 formation positions are distinct and visible

---

## Phase 4: Isaac Walk Animation - Opponent Select

### Goal
When player clicks an opponent card to select it, Isaac (or generic hero sprite) walks from bottom-center to the chosen card, then screen transitions to battle.

### 4.1 Add Isaac Sprite to OpponentSelectScreen
```tsx
// src/components/OpponentSelectScreen.tsx state
const [isaacPosition, setIsaacPosition] = useState({ x: 640, y: 680 }); // Bottom center
const [isaacTarget, setIsaacTarget] = useState<{ x: number; y: number } | null>(null);
const [isWalking, setIsWalking] = useState(false);
```

### 4.2 Calculate Card Center Positions
```tsx
// Get center of selected card for Isaac to walk to
const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

const getCardCenter = (index: number): { x: number; y: number } | null => {
  const card = cardRefs.current[index];
  if (!card) return null;
  
  const rect = card.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
};
```

### 4.3 Handle Opponent Selection
```tsx
const handleSelectOpponent = (opponentId: string, cardIndex: number) => {
  const target = getCardCenter(cardIndex);
  if (!target) return;
  
  setIsWalking(true);
  setIsaacTarget(target);
  
  // After walk completes, transition to battle
  setTimeout(() => {
    onSelect(opponentId);
  }, 1000); // 1 second walk + brief pause
};
```

### 4.4 Isaac Walking Component
```tsx
// Add Isaac sprite to screen
<div className="relative w-full h-full">
  {/* Opponent cards */}
  
  {/* Isaac sprite */}
  <img
    src="/sprites/golden-sun/isaac_walk.png"
    alt="Isaac"
    className="absolute pixel-art transition-all duration-1000 ease-in-out"
    style={{
      left: `${isaacPosition.x}px`,
      top: `${isaacPosition.y}px`,
      transform: 'translate(-50%, -50%)',
      width: '64px',
      height: '64px',
      zIndex: 100,
    }}
  />
</div>
```

### 4.5 Animate Isaac Position
```tsx
useEffect(() => {
  if (!isaacTarget || !isWalking) return;
  
  setIsaacPosition(isaacTarget);
}, [isaacTarget, isWalking]);
```

### 4.6 Add Walk Cycle Sprite Sheet (Optional Enhancement)
If you have Isaac walk cycle sprites:
```tsx
// Alternate between walk frames during movement
const [walkFrame, setWalkFrame] = useState(0);

useEffect(() => {
  if (!isWalking) return;
  
  const interval = setInterval(() => {
    setWalkFrame(prev => (prev + 1) % 4); // 4-frame walk cycle
  }, 150); // Frame every 150ms
  
  return () => clearInterval(interval);
}, [isWalking]);
```

### Acceptance Criteria
- [ ] Isaac sprite appears at bottom-center when screen loads
- [ ] Clicking opponent card makes Isaac walk to that card's position
- [ ] Walk animation takes ~1 second with smooth easing
- [ ] After reaching opponent, brief pause (200ms) then battle starts
- [ ] Isaac sprite uses pixel-art rendering (crisp)
- [ ] Optional: Walk cycle animation plays during movement

---

## Phase 5: Additional Polish (Optional Enhancements)

### 5.1 Menu Button Hover Effects
```css
/* Enhanced button hover (src/components/MenuButton.tsx) */
.menu-button {
  transition: all 0.2s ease;
}

.menu-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.menu-button:active {
  transform: translateY(0);
}
```

### 5.2 Card Flip Animation (Rewards Screen)
When revealing rewards:
```css
@keyframes card-flip {
  0% { transform: rotateY(0deg); }
  50% { transform: rotateY(90deg); }
  100% { transform: rotateY(0deg); }
}

.animate-card-flip {
  animation: card-flip 0.6s ease-in-out;
}
```

### 5.3 Battle Entry Flourish
Before battle starts, camera "zooms" into battlefield:
```css
@keyframes battle-zoom {
  from {
    transform: scale(1.3);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.battle-entry {
  animation: battle-zoom 0.8s ease-out;
}
```

### 5.4 Victory Confetti/Particles (Rewards Screen)
```tsx
// Simple particle effect when rewards appear
<div className="absolute inset-0 pointer-events-none">
  {[...Array(20)].map((_, i) => (
    <div
      key={i}
      className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-confetti"
      style={{
        left: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 0.5}s`
      }}
    />
  ))}
</div>
```

---

## Implementation Order (Recommended)

1. **Phase 1 first** (viewport standardization) - Foundation for all other work
2. **Phase 2** (screen transitions) - Quick win, immediate polish
3. **Phase 3** OR **Phase 4** (character animations) - Pick one based on priority
4. **Phase 5** (optional enhancements) - Cherry on top

---

## Testing Checklist

### Viewport Tests
- [ ] No scrolling at 1280x720
- [ ] No scrolling at 1920x1080 (letterboxed)
- [ ] No scrolling at 1024x768 (smaller, may scale down)
- [ ] Mobile: 375x667 (iPhone SE) - test responsiveness
- [ ] Mobile: 414x896 (iPhone 11) - test responsiveness

### Transition Tests
- [ ] Menu → Starter Select (smooth fade)
- [ ] Starter Select → Gem Select (smooth fade)
- [ ] Gem Select → Opponent Select (smooth fade)
- [ ] Opponent Select → Battle (smooth fade)
- [ ] Battle → Rewards (smooth fade)
- [ ] Rewards → Recruit (smooth fade)
- [ ] Recruit → Opponent Select (loop, smooth fade)

### Animation Tests
- [ ] Starter units walk into formation when selected
- [ ] Starter units walk back when deselected
- [ ] All 4 positions fill correctly
- [ ] Isaac walks to opponent card on selection
- [ ] Isaac walk path is direct (not diagonal artifacts)
- [ ] Screen transitions after Isaac reaches target

### Performance Tests
- [ ] Screen transitions don't cause lag (<16ms frames)
- [ ] Character animations run at 60fps
- [ ] No jank when multiple animations play simultaneously
- [ ] Reduced motion preference respected (instant transitions)

---

## Assets Needed

### Sprites
1. **Isaac Walk Sprite** (or generic hero)
   - Single static sprite: `isaac_idle.png` (64x64px)
   - Optional: Walk cycle sheet: `isaac_walk.png` (256x64px, 4 frames)
   - Source: Golden Sun sprite sheets

2. **Starter Unit Sprites** (if not already present)
   - All 12 starter units need walk-ready sprites
   - Current sprites should work with AnimatedSprite component

### Sprite Locations
- `/public/sprites/golden-sun/isaac_walk.png`
- `/public/sprites/party/*.png` (starter units)

---

## Notes for Graphics AI

- **Pixel Art**: All sprites should use `image-rendering: pixelated` (already in CSS as `.pixel-art`)
- **Sprite Sheets**: If using walk cycles, implement frame-by-frame component
- **Performance**: Use CSS transforms (not left/top) for animations when possible (GPU accelerated)
- **Accessibility**: Respect `prefers-reduced-motion` - disable all animations if set
- **Mobile**: Test on smaller viewports - may need to scale down or adjust layout
- **Z-Index Management**: Isaac sprite should be z-100, cards z-10, backgrounds z-0

---

## Fallback Plan (If Sprites Unavailable)

If Isaac sprite or walk cycles aren't available:
1. Use colored circle/square as placeholder
2. Add directional arrow → shows movement direction
3. Simple fade + position change (no walk animation)
4. Focus on screen transitions (Phases 1-2) instead of character animations (Phases 3-4)

---

## Success Criteria

**Must Have:**
- ✅ No scrolling on any screen
- ✅ Smooth screen transitions (fade or slide)
- ✅ Fixed game canvas dimensions

**Nice to Have:**
- ✅ Character walk animations (starter select)
- ✅ Isaac walk to opponent animation
- ✅ Staggered card entry animations

**Polish:**
- ✅ Hover effects on buttons
- ✅ Battle entry zoom
- ✅ Reward card flip/confetti

---

**Ready for Graphics AI to implement!** Start with Phase 1 (viewport), then Phase 2 (transitions), then pick character animations based on sprite availability.
