/*
 * StarterSelectScreen: Choose 4 starter units - COMPACT LAYOUT
 *
 * Features:
 * - Compact 4x3 grid on left (all units visible, NO SCROLLING)
 * - Selected team panel on right with full details
 * - Clear visual feedback with gold borders
 * - Start button enabled when 4 selected
 */

import React, { useState } from 'react';
import type { PlayerUnit } from '../types/game.js';
import { STARTER_CATALOG } from '../data/starterUnits.js';
import { getPartySpriteSet } from '../data/spriteRegistry.js';

export interface StarterSelectScreenProps {
  onSelect: (starters: PlayerUnit[]) => void;
  onCancel: () => void;
}

// Helper functions
const getRoleColor = (role: string): string => {
  const colors: Record<string, string> = {
    'Tank': '#64b5f6',
    'DPS': '#ef5350',
    'Support': '#66bb6a',
    'Specialist': '#ab47bc'
  };
  return colors[role] || '#888';
};

const getElementColor = (element: string): string => {
  const colors: Record<string, string> = {
    'Moon': '#ffd54f',      // Holy/Light
    'Venus': '#81c784',     // Nature/Earth
    'Mars': '#ef5350',      // Fire
    'Jupiter': '#ba68c8',   // Wind
    'Mercury': '#64b5f6',   // Water
    'Sun': '#ff8a65'        // Dark
  };
  return colors[element] || '#888';
};

const getUnitSprite = (unit: PlayerUnit): string => {
  // Try portrait first, then sprite set
  if (unit.portraitUrl) return unit.portraitUrl;

  const spriteSet = getPartySpriteSet(unit.name);
  if (spriteSet) return spriteSet.idle;

  return '/sprites/party/default_idle.gif';
};

export function StarterSelectScreen({
  onSelect,
  onCancel,
}: StarterSelectScreenProps): React.ReactElement {
  const [selectedUnits, setSelectedUnits] = useState<PlayerUnit[]>([]);

  const maxSelection = 4;
  const canStart = selectedUnits.length === maxSelection;

  // Handle unit selection
  const handleUnitSelect = (unit: PlayerUnit) => {
    // If already selected, remove it
    if (selectedUnits.some(u => u.id === unit.id)) {
      setSelectedUnits(prev => prev.filter(u => u.id !== unit.id));
      return;
    }

    // If less than 4, add it
    if (selectedUnits.length < maxSelection) {
      setSelectedUnits(prev => [...prev, unit]);
    }
  };

  // Remove unit from specific slot
  const handleRemoveUnit = (slotIndex: number) => {
    setSelectedUnits(prev => prev.filter((_, idx) => idx !== slotIndex));
  };

  // Start game
  const handleStart = () => {
    if (canStart) {
      onSelect(selectedUnits);
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      gap: '24px',
      padding: '20px',
      backgroundColor: '#0a0e27',
      color: 'white',
      overflow: 'hidden'
    }}>
      {/* LEFT SIDE - Compact Unit Grid */}
      <div style={{
        flex: '0 0 68%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: 'bold' }}>
            Choose Your Team
          </h2>
          <p style={{ margin: 0, color: '#888', fontSize: '14px' }}>
            Select exactly 4 units to begin your journey
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '16px', fontWeight: 'bold', color: canStart ? '#66bb6a' : '#888' }}>
            Selected: {selectedUnits.length}/4
          </p>
        </div>

        {/* Compact Grid - 4x3 layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          maxWidth: '800px'
        }}>
          {STARTER_CATALOG.map(unit => {
            const isSelected = selectedUnits.some(u => u.id === unit.id);

            return (
              <div
                key={unit.id}
                onClick={() => handleUnitSelect(unit)}
                style={{
                  border: isSelected ? '3px solid #ffd700' : '2px solid #444',
                  borderRadius: '12px',
                  padding: '12px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'rgba(255, 215, 0, 0.15)' : '#1a1a2e',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 0 20px rgba(255, 215, 0, 0.4)' : 'none'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.borderColor = isSelected ? '#ffd700' : '#666';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.borderColor = isSelected ? '#ffd700' : '#444';
                }}
              >
                {/* Small Portrait */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  margin: '0 auto 8px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '2px solid #333'
                }}>
                  <img
                    src={getUnitSprite(unit)}
                    alt={unit.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      imageRendering: 'pixelated'
                    }}
                  />
                </div>

                {/* Unit Name */}
                <div style={{
                  fontSize: '14px',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  color: isSelected ? '#ffd700' : 'white',
                  marginBottom: '4px'
                }}>
                  {unit.name}
                </div>

                {/* Small role indicator */}
                <div style={{
                  fontSize: '10px',
                  color: '#888',
                  textTransform: 'uppercase'
                }}>
                  {unit.role}
                </div>
              </div>
            );
          })}
        </div>

        {/* Back to Menu Button */}
        <div style={{ marginTop: '24px' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              backgroundColor: '#444',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#555';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#444';
            }}
          >
            ← Back to Menu
          </button>
        </div>
      </div>

      {/* RIGHT SIDE - Selected Team Panel */}
      <div style={{
        flex: '0 0 32%',
        backgroundColor: '#16213e',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid #2a3f5f',
        overflow: 'hidden'
      }}>
        <h3 style={{
          margin: '0 0 20px 0',
          fontSize: '22px',
          borderBottom: '2px solid #444',
          paddingBottom: '10px'
        }}>
          Your Team ({selectedUnits.length}/4)
        </h3>

        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          overflowY: 'auto',
          marginBottom: '16px'
        }}>
          {[0, 1, 2, 3].map(slotIndex => {
            const unit = selectedUnits[slotIndex];

            return (
              <div
                key={slotIndex}
                style={{
                  border: '2px solid #444',
                  borderRadius: '8px',
                  padding: '12px',
                  backgroundColor: unit ? '#1a1a2e' : '#0f1419',
                  minHeight: '160px'
                }}
              >
                {unit ? (
                  <>
                    {/* Header with sprite and name */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '10px',
                      gap: '12px'
                    }}>
                      <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '2px solid #444',
                        flexShrink: 0
                      }}>
                        <img
                          src={getUnitSprite(unit)}
                          alt={unit.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            imageRendering: 'pixelated'
                          }}
                        />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: 'bold',
                          marginBottom: '4px'
                        }}>
                          {unit.name}
                        </div>
                        <div style={{ fontSize: '12px' }}>
                          <span style={{ color: getRoleColor(unit.role) }}>
                            {unit.role}
                          </span>
                          {' • '}
                          <span style={{ color: getElementColor(unit.element) }}>
                            {unit.element}
                          </span>
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveUnit(slotIndex)}
                        style={{
                          padding: '4px 8px',
                          fontSize: '11px',
                          backgroundColor: '#d32f2f',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          color: 'white',
                          fontWeight: 'bold',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#b71c1c';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#d32f2f';
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Stats Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '6px',
                      fontSize: '11px',
                      marginBottom: '8px',
                      backgroundColor: '#0a0e1a',
                      padding: '8px',
                      borderRadius: '6px'
                    }}>
                      <div>HP: {unit.maxHp}</div>
                      <div>ATK: {unit.atk}</div>
                      <div>MP: {unit.currentMp}</div>
                      <div>DEF: {unit.def}</div>
                      <div style={{ gridColumn: '1 / -1' }}>SPD: {unit.speed}</div>
                    </div>

                    {/* Spells */}
                    {unit.learnedSpells && unit.learnedSpells.length > 0 && (
                      <div style={{ fontSize: '10px' }}>
                        <div style={{
                          fontWeight: 'bold',
                          marginBottom: '3px',
                          color: '#88c0d0'
                        }}>
                          Spells:
                        </div>
                        {unit.learnedSpells.slice(0, 3).map((spell, idx) => (
                          <div key={idx} style={{ color: '#aaa', marginLeft: '8px' }}>
                            • {spell.name} ({spell.cost} MP)
                          </div>
                        ))}
                        {unit.learnedSpells.length > 3 && (
                          <div style={{ color: '#666', marginLeft: '8px', fontStyle: 'italic' }}>
                            +{unit.learnedSpells.length - 3} more...
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: '#666',
                    fontSize: '14px',
                    fontStyle: 'italic'
                  }}>
                    Slot {slotIndex + 1}: Empty
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={!canStart}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: '16px',
            fontWeight: 'bold',
            backgroundColor: canStart ? '#4caf50' : '#333',
            color: canStart ? 'white' : '#666',
            border: 'none',
            borderRadius: '8px',
            cursor: canStart ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => {
            if (canStart) {
              e.currentTarget.style.backgroundColor = '#45a049';
              e.currentTarget.style.transform = 'scale(1.02)';
            }
          }}
          onMouseLeave={(e) => {
            if (canStart) {
              e.currentTarget.style.backgroundColor = '#4caf50';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          {canStart
            ? '🚀 Start Adventure!'
            : `Select ${4 - selectedUnits.length} more unit${4 - selectedUnits.length === 1 ? '' : 's'}`
          }
        </button>
      </div>
    </div>
  );
}
