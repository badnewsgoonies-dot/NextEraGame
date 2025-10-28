/**
 * Gem Super Panel
 *
 * Displays the global gem super ability on the left side of the battle screen.
 * Shows gem element, name, and activation status.
 *
 * Visual States:
 * - AVAILABLE: Clickable button, gem is ready to use (with pulsing glow animation)
 * - USED: Grayed out, shows "Used this battle" message
 * - NO_GEM: No gem selected (shouldn't happen in battle, but defensive)
 *
 * Visual Enhancements (Session 3B):
 * - Animated gem sprites instead of emojis
 * - Pulsing glow effect when available
 * - Element-specific gradient backgrounds
 * - Hover scale and glow effects
 * - Click flash animation
 * - Smooth transitions
 *
 * Pure component - state managed by parent (BattleScreen)
 */

import React, { useState } from 'react';
import type { Element } from '../../types/game.js';

export interface GemSuperPanelProps {
  /** Name of the active gem (e.g., "Mars Gem") */
  gemName: string | null;

  /** Element of the active gem */
  gemElement: Element | null;

  /** Whether gem super is available to use (not used this battle) */
  isAvailable: boolean;

  /** Callback when activate button is clicked */
  onActivate: () => void;
}

/**
 * Get element theme (gradient, glow color, etc.)
 */
function getElementTheme(element: Element | null): {
  gradient: string;
  glow: string;
  textColor: string;
  buttonBg: string;
  buttonHover: string;
  shadowColor: string;
} {
  if (!element) {
    return {
      gradient: 'linear-gradient(135deg, #4B5563 0%, #374151 100%)',
      glow: 'rgba(156, 163, 175, 0.5)',
      textColor: '#9CA3AF',
      buttonBg: '#4B5563',
      buttonHover: '#6B7280',
      shadowColor: 'rgba(156, 163, 175, 0.3)',
    };
  }

  switch (element) {
    case 'Mars': // Fire
      return {
        gradient: 'linear-gradient(135deg, #DC2626 0%, #EA580C 100%)',
        glow: 'rgba(239, 68, 68, 0.6)',
        textColor: '#FCA5A5',
        buttonBg: '#DC2626',
        buttonHover: '#EF4444',
        shadowColor: 'rgba(239, 68, 68, 0.4)',
      };
    case 'Mercury': // Water
      return {
        gradient: 'linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)',
        glow: 'rgba(59, 130, 246, 0.6)',
        textColor: '#93C5FD',
        buttonBg: '#2563EB',
        buttonHover: '#3B82F6',
        shadowColor: 'rgba(59, 130, 246, 0.4)',
      };
    case 'Jupiter': // Wind/Lightning
      return {
        gradient: 'linear-gradient(135deg, #EAB308 0%, #A855F7 100%)',
        glow: 'rgba(234, 179, 8, 0.6)',
        textColor: '#FDE047',
        buttonBg: '#EAB308',
        buttonHover: '#FACC15',
        shadowColor: 'rgba(234, 179, 8, 0.4)',
      };
    case 'Venus': // Earth
      return {
        gradient: 'linear-gradient(135deg, #16A34A 0%, #10B981 100%)',
        glow: 'rgba(34, 197, 94, 0.6)',
        textColor: '#86EFAC',
        buttonBg: '#16A34A',
        buttonHover: '#22C55E',
        shadowColor: 'rgba(34, 197, 94, 0.4)',
      };
    case 'Moon': // Light
      return {
        gradient: 'linear-gradient(135deg, #9333EA 0%, #EC4899 100%)',
        glow: 'rgba(168, 85, 247, 0.6)',
        textColor: '#E9D5FF',
        buttonBg: '#9333EA',
        buttonHover: '#A855F7',
        shadowColor: 'rgba(168, 85, 247, 0.4)',
      };
    case 'Sun': // Sun/Light
      return {
        gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
        glow: 'rgba(251, 191, 36, 0.6)',
        textColor: '#FDE68A',
        buttonBg: '#F59E0B',
        buttonHover: '#FBBF24',
        shadowColor: 'rgba(251, 191, 36, 0.4)',
      };
    default:
      return {
        gradient: 'linear-gradient(135deg, #4B5563 0%, #374151 100%)',
        glow: 'rgba(156, 163, 175, 0.5)',
        textColor: '#9CA3AF',
        buttonBg: '#4B5563',
        buttonHover: '#6B7280',
        shadowColor: 'rgba(156, 163, 175, 0.3)',
      };
  }
}

/**
 * Get gem sprite path for element
 */
function getGemSprite(element: Element | null): string | null {
  if (!element) return null;

  const elementLower = element.toLowerCase();
  return `/sprites/ui/gems/${elementLower}.gif`;
}

export function GemSuperPanel({
  gemName,
  gemElement,
  isAvailable,
  onActivate,
}: GemSuperPanelProps): React.ReactElement {
  const theme = getElementTheme(gemElement);
  const gemSprite = getGemSprite(gemElement);
  const [isActivating, setIsActivating] = useState(false);

  // Handle activation with flash animation
  const handleActivate = () => {
    setIsActivating(true);
    // Call immediately for game logic
    onActivate();
    // Clear flash animation after visual feedback
    setTimeout(() => {
      setIsActivating(false);
    }, 150);
  };

  // No gem selected (defensive - shouldn't happen)
  if (!gemName || !gemElement) {
    return (
      <div
        className="gem-super-panel p-4 bg-gray-800 border-2 border-gray-600 rounded-lg"
        style={{ width: '192px' }}
      >
        <div className="text-sm text-gray-500 text-center">
          No Gem Selected
        </div>
      </div>
    );
  }

  // Inline styles for dynamic values and animations
  const panelStyle: React.CSSProperties = {
    width: '192px',
    background: isAvailable ? theme.gradient : 'rgba(31, 41, 55, 0.9)',
    borderColor: isAvailable ? theme.glow : '#4B5563',
    boxShadow: isAvailable
      ? `0 0 20px ${theme.shadowColor}, 0 4px 12px rgba(0, 0, 0, 0.3)`
      : '0 2px 8px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
    animation: isAvailable ? 'gemPulse 2s ease-in-out infinite' : undefined,
    transform: isActivating ? 'scale(0.95)' : undefined,
    filter: isActivating ? 'brightness(1.5)' : undefined,
  };

  const buttonStyle: React.CSSProperties = {
    background: theme.buttonBg,
    transition: 'all 0.2s ease',
  };

  const buttonHoverStyle: React.CSSProperties = {
    background: theme.buttonHover,
    transform: 'scale(1.05)',
    boxShadow: `0 0 20px ${theme.glow}`,
  };

  return (
    <>
      {/* CSS Keyframes */}
      <style>{`
        @keyframes gemPulse {
          0%, 100% {
            box-shadow: 0 0 20px ${theme.shadowColor}, 0 4px 12px rgba(0, 0, 0, 0.3);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 40px ${theme.glow}, 0 6px 16px rgba(0, 0, 0, 0.4);
            transform: scale(1.02);
          }
        }

        @keyframes gemSpin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .gem-sprite {
          transition: all 0.3s ease;
          filter: ${isAvailable ? 'brightness(1.2) drop-shadow(0 0 8px currentColor)' : 'grayscale(100%) brightness(0.5)'};
        }

        .gem-sprite:hover {
          ${isAvailable ? 'transform: scale(1.1); filter: brightness(1.5) drop-shadow(0 0 12px currentColor);' : ''}
        }

        .gem-activate-button {
          transition: all 0.2s ease;
        }

        .gem-activate-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px ${theme.glow};
        }

        .gem-activate-button:active {
          transform: scale(0.98);
        }
      `}</style>

      <div
        className="gem-super-panel p-4 border-2 rounded-lg backdrop-blur-sm"
        style={panelStyle}
      >
        {/* Header */}
        <div className="text-xs text-gray-300 uppercase tracking-wide mb-2 font-semibold">
          Gem Super
        </div>

        {/* Gem Sprite & Name */}
        <div className="flex items-center gap-3 mb-3">
          {gemSprite ? (
            <img
              src={gemSprite}
              alt={`${gemElement} gem`}
              role="img"
              aria-label={`${gemElement} element`}
              className="gem-sprite w-12 h-12"
              style={{
                imageRendering: 'pixelated',
                color: theme.textColor,
              }}
            />
          ) : (
            <div
              className="gem-sprite text-4xl w-12 h-12 flex items-center justify-center"
              role="img"
              aria-label={`${gemElement} element`}
              style={{ color: theme.textColor }}
            >
              💎
            </div>
          )}
          <div>
            <div
              className="text-lg font-bold"
              style={{ color: isAvailable ? theme.textColor : '#6B7280' }}
            >
              {gemElement}
            </div>
            <div className="text-xs text-gray-400">
              {gemName}
            </div>
          </div>
        </div>

        {/* Status / Activate Button */}
        {isAvailable ? (
          <button
            onClick={handleActivate}
            className="gem-activate-button w-full py-2 px-4 text-white font-bold rounded
              focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              ...buttonStyle,
              boxShadow: `0 2px 8px ${theme.shadowColor}`,
            }}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, buttonHoverStyle);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, buttonStyle);
            }}
            aria-label={`Activate ${gemName} super attack`}
            disabled={isActivating}
          >
            {isActivating ? 'Activating...' : 'Activate'}
          </button>
        ) : (
          <div className="text-center py-2 px-4 bg-gray-800/80 text-gray-500 text-sm rounded border border-gray-700">
            Used this battle
          </div>
        )}

        {/* Helper Text */}
        <div className="mt-3 text-xs text-center" style={{ color: isAvailable ? theme.textColor : '#6B7280' }}>
          AOE damage to all enemies
        </div>
      </div>
    </>
  );
}
