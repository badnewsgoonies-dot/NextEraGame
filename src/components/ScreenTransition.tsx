import { useState, useEffect, useRef } from 'react';

/**
 * ScreenTransition - Smooth transitions between game screens
 * 
 * Features:
 * - Fade, slide, or crossfade animations
 * - Configurable duration (default 300ms)
 * - Respects prefers-reduced-motion
 * - Key-based transitions (changes when screen changes)
 */

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
  const previousKeyRef = useRef(screenKey);
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = 
    typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    // Only trigger transition if screen actually changed
    if (previousKeyRef.current !== screenKey) {
      setIsTransitioning(true);
      
      // For reduced motion, skip animation
      const transitionDuration = prefersReducedMotion ? 0 : duration;
      
      const timer = setTimeout(() => {
        setDisplayedChildren(children);
        setIsTransitioning(false);
        previousKeyRef.current = screenKey;
      }, transitionDuration);

      return () => clearTimeout(timer);
    } else {
      // First render or no screen change
      setDisplayedChildren(children);
      previousKeyRef.current = screenKey;
      return undefined;
    }
  }, [screenKey, children, duration, prefersReducedMotion]);

  // Transition classes based on type
  const getTransitionClasses = () => {
    if (prefersReducedMotion) return ''; // No animation
    
    const baseClasses = 'transition-all ease-out';
    
    const typeClasses = {
      fade: isTransitioning ? 'opacity-0' : 'opacity-100',
      'slide-left': isTransitioning ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100',
      'slide-right': isTransitioning ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100',
      crossfade: isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    };

    return `${baseClasses} ${typeClasses[type]}`;
  };

  return (
    <div 
      className={getTransitionClasses()}
      style={{ 
        transitionDuration: prefersReducedMotion ? '0ms' : `${duration}ms`,
        width: '100%',
        height: '100%'
      }}
    >
      {displayedChildren}
    </div>
  );
}
