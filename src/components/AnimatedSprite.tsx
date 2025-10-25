import { useState, useEffect, useRef } from 'react';

/**
 * AnimatedSprite - Animated sprite movement component
 * 
 * Features:
 * - Smooth position interpolation (start → end)
 * - Configurable duration and easing
 * - Callback on animation complete
 * - Uses requestAnimationFrame for smooth 60fps
 * - Supports pixel art rendering
 */

interface AnimatedSpriteProps {
  src: string;
  alt?: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  duration: number; // milliseconds
  size?: number; // sprite size in pixels (default 64)
  onComplete?: () => void;
  className?: string;
}

export function AnimatedSprite({
  src,
  alt = 'Sprite',
  startX,
  startY,
  endX,
  endY,
  duration,
  size = 64,
  onComplete,
  className = '',
}: AnimatedSpriteProps) {
  const [currentX, setCurrentX] = useState(startX);
  const [currentY, setCurrentY] = useState(startY);
  const animationRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Reset position when start coordinates change
    setCurrentX(startX);
    setCurrentY(startY);
    startTimeRef.current = undefined;
  }, [startX, startY]);

  useEffect(() => {
    // Animation loop
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out cubic)
      const eased = 1 - Math.pow(1 - progress, 3);

      // Interpolate position
      const newX = startX + (endX - startX) * eased;
      const newY = startY + (endY - startY) * eased;

      setCurrentX(newX);
      setCurrentY(newY);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        if (onComplete) {
          onComplete();
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [startX, startY, endX, endY, duration, onComplete]);

  return (
    <img
      src={src}
      alt={alt}
      className={`absolute pixel-art sprite-idle ${className}`}
      style={{
        left: `${currentX}px`,
        top: `${currentY}px`,
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    />
  );
}
