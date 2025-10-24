/*
 * OpponentCard: Interactive opponent preview card
 * 
 * Features:
 * - Displays opponent name, difficulty, tags, units, rewards
 * - Expandable on focus/hover
 * - Keyboard navigation (Enter/Space to select, arrows to navigate)
 * - ARIA labels for accessibility
 * - Performance: <1ms render (React.memo)
 * 
 * Per architecture decisions:
 * - No ThreatBadge (Decision #2)
 * - Shows CounterTags if feature enabled (Decision #4)
 * - Shows DifficultyDots instead of threat score
 */

import React from 'react';
import type { OpponentPreview, Tag, Role } from '../types/game.js';
import { DifficultyDots } from './DifficultyDots.js';
import { CounterTags } from './CounterTags.js';
import { DEFAULT_FLAGS } from '../types/game.js';

// Helper to get tag-specific classes (Tailwind JIT needs full class names)
function getPrimaryTagClasses(tag: Tag): string {
  const baseClasses = 'inline-block px-3 py-1 rounded-md text-sm font-semibold text-white';
  const tagColors: Record<Tag, string> = {
    Undead: 'bg-tag-undead',
    Mech: 'bg-tag-mech',
    Beast: 'bg-tag-beast',
    Holy: 'bg-tag-holy',
    Arcane: 'bg-tag-arcane',
    Nature: 'bg-tag-nature',
  };
  return `${baseClasses} ${tagColors[tag]}`;
}

// Helper to get role-specific classes
function getRoleDotClasses(role: Role): string {
  const roleColors: Record<Role, string> = {
    Tank: 'bg-role-tank',
    DPS: 'bg-role-dps',
    Support: 'bg-role-support',
    Specialist: 'bg-role-specialist',
  };
  return `w-2 h-2 rounded-full ${roleColors[role]}`;
}

export interface OpponentCardProps {
  preview: OpponentPreview;
  selected: boolean;
  focused: boolean;
  expanded: boolean;
  onSelect: () => void;
  onFocus: () => void;
  onToggleExpand: () => void;
  tabIndex: number; // 0 for focused, -1 for unfocused (roving tabindex)
}

export const OpponentCard = React.memo(function OpponentCard({
  preview,
  selected,
  focused,
  expanded,
  onSelect,
  onFocus,
  onToggleExpand,
  tabIndex,
}: OpponentCardProps): React.ReactElement {
  const { spec, counterTags, unitSummaries } = preview;

  // Keyboard handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      onToggleExpand();
    }
  };

  // Opacity based on state
  const opacity = focused || selected ? 'opacity-100' : 'opacity-80';

  // Get first enemy unit sprite for preview
  const previewSprite = spec.units[0]?.spriteUrl;

  return (
    <div
      role="radio"
      aria-checked={selected}
      aria-label={`${spec.name}, ${spec.difficulty} difficulty, ${spec.primaryTag} type, ${spec.units.length} units${expanded ? ', expanded' : ''}`}
      aria-describedby={expanded ? `${spec.id}-details` : undefined}
      tabIndex={tabIndex}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
      onClick={onSelect}
      className={`
        bg-gradient-to-br from-amber-900/95 via-yellow-800/95 to-amber-900/95
        border-4 ${selected ? 'border-yellow-300' : 'border-yellow-600'}
        rounded-lg p-6
        ${selected ? 'shadow-[0_0_30px_rgba(253,224,71,0.6)]' : 'shadow-2xl shadow-yellow-900/50'}
        ${opacity}
        transition-all duration-300 cursor-pointer
        hover:scale-105 hover:shadow-[0_0_30px_rgba(253,224,71,0.4)] hover:border-yellow-400
        focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-offset-2
        relative overflow-hidden
      `}
    >
      {/* Golden corner decorations */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-400 opacity-60" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-400 opacity-60" />

      {/* Enemy Sprite Preview */}
      {previewSprite && (
        <div className="flex justify-center mb-4">
          <img 
            src={previewSprite}
            alt={`${spec.name} sprite`}
            className="w-24 h-24 object-contain pixel-art drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      )}

      {/* Header: Name + Difficulty */}
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl font-bold text-yellow-300 drop-shadow-lg">
          {spec.name}
        </div>
        <DifficultyDots difficulty={spec.difficulty} />
      </div>

      {/* Primary Tag */}
      <div className="mb-3">
        <span className={getPrimaryTagClasses(spec.primaryTag)}>
          {spec.primaryTag}
        </span>
      </div>

      {/* Counter Tags (feature-flagged) */}
      {counterTags.length > 0 && (
        <CounterTags 
          counterTags={counterTags} 
          enabled={DEFAULT_FLAGS.counterTags}
          className="mb-3"
        />
      )}

      {/* Unit Summaries */}
      {unitSummaries && (
        <div className="mb-3">
          <div className="text-xs font-semibold text-yellow-200 mb-2">
            Units ({unitSummaries.length}):
          </div>
          <ul className="space-y-1" role="list">
            {unitSummaries.slice(0, expanded ? undefined : 2).map((unit, idx) => (
              <li 
                key={idx} 
                className="text-sm text-amber-100 flex items-center gap-2"
                role="listitem"
              >
                <span className={getRoleDotClasses(unit.role)} aria-hidden="true" />
                <span>{unit.name}</span>
                <span className="text-xs text-yellow-300">({unit.role})</span>
              </li>
            ))}
            {!expanded && unitSummaries.length > 2 && (
              <li className="text-xs text-yellow-400 italic">
                +{unitSummaries.length - 2} more... (press ↓ to expand)
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Special Rule (expanded view) */}
      {expanded && spec.specialRule && (
        <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
          <div className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1">
            Special Rule:
          </div>
          <p className="text-sm text-amber-900 dark:text-amber-200">
            {spec.specialRule}
          </p>
        </div>
      )}

      {/* Reward Hint */}
      <div className="pt-3 border-t border-yellow-600/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-yellow-200">
            Reward:
          </span>
          <span className="text-sm text-emerald-300 font-medium">
            {spec.rewardHint}
          </span>
        </div>
      </div>

      {/* Selection Hint */}
      {selected && (
        <div className="mt-3 text-center text-sm font-semibold text-yellow-100 animate-pulse">
          ✓ Selected (press Enter to confirm)
        </div>
      )}
    </div>
  );
});

