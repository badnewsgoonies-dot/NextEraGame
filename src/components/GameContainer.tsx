import React from 'react';

/**
 * GameContainer - Fixed viewport wrapper for the game
 * 
 * Purpose: Eliminate scrolling by constraining game to 1280x720px canvas
 * - Centers game on larger displays (letterbox effect)
 * - Scales down on smaller displays (responsive)
 * - Black background for letterboxing
 */
interface GameContainerProps {
  children: React.ReactNode;
}

export function GameContainer({ children }: GameContainerProps) {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      <div 
        className="relative bg-gray-900 overflow-hidden"
        style={{ 
          width: '1280px', 
          height: '720px',
          maxWidth: '100vw',
          maxHeight: '100vh',
        }}
      >
        {children}
      </div>
    </div>
  );
}
