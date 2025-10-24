/*
 * Integration Tests: Progression Systems
 * 
 * Verifies all progression systems work together:
 * - Stats + Rank + Gem + Ability integration
 * - Full equipment flows
 * - Merge + recalculation flows
 * - Battle state restoration
 */

import { describe, test, expect } from 'vitest';
import { equipGem, unequipGem, useGemEffect, activateAllGems, getUnitAbilities } from '../../src/systems/GemSystem';
import { mergeUnits } from '../../src/systems/RankSystem';
import { calculateUnitStats } from '../../src/systems/StatsSystem';
import { useAbility, restoreAllMp } from '../../src/systems/AbilitySystem';
import type { PlayerUnit } from '../../src/types/game';

describe('Integration: Progression Systems', () => {
  function createTestUnit(overrides: Partial<PlayerUnit> = {}): PlayerUnit {
    return {
      id: 'test-unit-1',
      templateId: 'warrior',
      name: 'Test Warrior',
      role: 'Tank',
      tags: ['Holy'],
      hp: 100,
      maxHp: 100,
      atk: 20,
      def: 15,
      speed: 40,
      level: 1,
      experience: 0,
      rank: 'C',
      baseClass: 'Warrior',
      currentMp: 50,
      ...overrides,
    };
  }

  test('Full flow: Equip gem → Stats increase → Subclass granted → Ability available', () => {
    // Start with base unit
    let unit = createTestUnit();
    const baseStats = calculateUnitStats(unit);
    
    // Equip Ruby Gem
    const equipResult = equipGem(unit, 'ruby_gem');
    expect(equipResult.ok).toBe(true);
    if (!equipResult.ok) return;
    
    unit = equipResult.value;
    
    // Verify subclass granted
    expect(unit.subclass).toBe('Fire Adept');
    
    // Verify stats increased
    const gemedStats = calculateUnitStats(unit);
    expect(gemedStats.attack).toBeGreaterThan(baseStats.attack); // +5 from gem + Fire Adept bonus
    
    // Verify ability available
    const abilities = getUnitAbilities(unit);
    expect(abilities).toHaveLength(1);
    expect(abilities[0].id).toBe('fireball');
  });

  test('Full flow: Use ability → MP decreases → Ability works', () => {
    // Setup unit with gem
    let unit = createTestUnit({ currentMp: 50 });
    const equipResult = equipGem(unit, 'ruby_gem');
    if (!equipResult.ok) throw new Error('Setup failed');
    unit = equipResult.value;
    
    // Get ability
    const abilities = getUnitAbilities(unit);
    const fireball = abilities[0];
    
    // Use ability
    const useResult = useAbility(unit, fireball);
    expect(useResult.ok).toBe(true);
    if (!useResult.ok) return;
    
    // Verify MP decreased
    expect(useResult.value.currentMp).toBe(30); // 50 - 20
  });

  test('Full flow: Use gem effect → Deactivate → Stats decrease → Subclass persists', () => {
    // Setup unit with active gem
    let unit = createTestUnit();
    const equipResult = equipGem(unit, 'ruby_gem');
    if (!equipResult.ok) throw new Error('Setup failed');
    unit = equipResult.value;
    
    const activeStats = calculateUnitStats(unit);
    
    // Use gem effect
    const effectResult = useGemEffect(unit);
    expect(effectResult.ok).toBe(true);
    if (!effectResult.ok) return;
    unit = effectResult.value;
    
    // Verify gem deactivated
    expect(unit.equippedGem?.state).toBe('inactive');
    
    // Verify stats decreased (lost passive)
    const inactiveStats = calculateUnitStats(unit);
    expect(inactiveStats.attack).toBeLessThan(activeStats.attack); // Lost +5 ATK passive
    
    // Verify subclass still active!
    expect(unit.subclass).toBe('Fire Adept');
    
    // Verify ability still available
    const abilities = getUnitAbilities(unit);
    expect(abilities).toHaveLength(1);
    expect(abilities[0].id).toBe('fireball');
  });

  test('Full flow: Next battle → Gem reactivates → Stats restored', () => {
    // Setup unit with inactive gem (from previous battle)
    let unit = createTestUnit({
      equippedGem: { gemId: 'ruby_gem', state: 'inactive' },
      subclass: 'Fire Adept',
    });
    
    const inactiveStats = calculateUnitStats(unit);
    
    // Start new battle - activate gems
    const team = activateAllGems([unit]);
    unit = team[0];
    
    // Verify gem reactivated
    expect(unit.equippedGem?.state).toBe('active');
    
    // Verify stats restored
    const activeStats = calculateUnitStats(unit);
    expect(activeStats.attack).toBeGreaterThan(inactiveStats.attack);
  });

  test('Full flow: Find duplicate → Merge → Rank up → Stats increase', () => {
    // Two identical units
    const unit1 = createTestUnit({ id: 'unit-1', rank: 'C', hp: 100, maxHp: 100 });
    const unit2 = createTestUnit({ id: 'unit-2', rank: 'C' });
    
    const baseStats = calculateUnitStats(unit1);
    
    // Merge unit2 into unit1
    const mergeResult = mergeUnits(unit1, unit2);
    expect(mergeResult.ok).toBe(true);
    if (!mergeResult.ok) return;
    
    const merged = mergeResult.value;
    
    // Verify rank increased
    expect(merged.rank).toBe('B');
    
    // Verify stats increased
    const mergedStats = calculateUnitStats(merged);
    expect(mergedStats.maxHp).toBeGreaterThan(baseStats.maxHp);
    expect(mergedStats.attack).toBeGreaterThan(baseStats.attack);
  });

  test('Full flow: B rank + Gem + Subclass = Stacked bonuses', () => {
    // Create B rank unit
    let unit = createTestUnit({ rank: 'B' });
    
    // Equip Ruby Gem (Fire Adept + +5 ATK)
    const equipResult = equipGem(unit, 'ruby_gem');
    if (!equipResult.ok) throw new Error('Setup failed');
    unit = equipResult.value;
    
    const stats = calculateUnitStats(unit);
    
    // Base: 20 ATK
    // Rank B: 20 * 1.15 = 23 ATK
    // Fire Adept: 23 * 1.10 = 25.3 → 25 ATK
    // Ruby passive: 25 + 5 = 30 ATK
    expect(stats.attack).toBe(30);
  });

  test('Multiple units with different gems have different bonuses', () => {
    const warrior = createTestUnit({ id: 'warrior' });
    const mage = createTestUnit({ id: 'mage' });
    
    // Warrior gets Ruby (Fire Adept, +5 ATK)
    const warriorGemmed = equipGem(warrior, 'ruby_gem');
    expect(warriorGemmed.ok).toBe(true);
    
    // Mage gets Sapphire (Water Adept, +3 DEF, +10 HP)
    const mageGemmed = equipGem(mage, 'sapphire_gem');
    expect(mageGemmed.ok).toBe(true);
    
    // Verify different subclasses
    if (warriorGemmed.ok && mageGemmed.ok) {
      expect(warriorGemmed.value.subclass).toBe('Fire Adept');
      expect(mageGemmed.value.subclass).toBe('Water Adept');
      
      // Verify different abilities
      const warriorAbilities = getUnitAbilities(warriorGemmed.value);
      const mageAbilities = getUnitAbilities(mageGemmed.value);
      
      expect(warriorAbilities[0].id).toBe('fireball');
      expect(mageAbilities[0].id).toBe('cure');
    }
  });

  test('Battle flow: Start battle → Restore MP → Use abilities → Use gem → Activate gems next battle', () => {
    // Setup team with gems
    let team = [
      createTestUnit({ 
        id: 'unit-1', 
        currentMp: 10, // Low MP from previous battle
        equippedGem: { gemId: 'ruby_gem', state: 'inactive' }, // Used gem effect
      }),
      createTestUnit({ 
        id: 'unit-2',
        currentMp: 20,
        equippedGem: { gemId: 'sapphire_gem', state: 'inactive' },
      }),
    ];
    
    // Start new battle
    team = restoreAllMp(team);
    team = activateAllGems(team);
    
    // Verify MP restored
    expect(team[0].currentMp).toBe(50);
    expect(team[1].currentMp).toBe(50);
    
    // Verify gems reactivated
    expect(team[0].equippedGem?.state).toBe('active');
    expect(team[1].equippedGem?.state).toBe('active');
  });

  test('S rank + Earth Adept + Emerald gem = Maximum tankiness', () => {
    // Create ultimate tank build
    let unit = createTestUnit({ 
      rank: 'S',      // +50% all stats
      hp: 100,
      maxHp: 100,
      def: 20,
    });
    
    // Equip Emerald (Earth Adept + +5 DEF)
    const equipResult = equipGem(unit, 'emerald_gem');
    if (!equipResult.ok) throw new Error('Setup failed');
    unit = equipResult.value;
    
    const stats = calculateUnitStats(unit);
    
    // Base: 100 HP, 20 DEF
    // Rank S: 150 HP, 30 DEF
    // Earth Adept: 165 HP, 34.5 DEF
    // Emerald: 165 HP, 39 DEF
    expect(stats.maxHp).toBe(165);
    expect(stats.defense).toBeGreaterThanOrEqual(39);
  });

  test('Unequipping gem mid-progression preserves rank but removes subclass', () => {
    // Create A rank unit with gem
    let unit = createTestUnit({ rank: 'A' });
    const equipResult = equipGem(unit, 'ruby_gem');
    if (!equipResult.ok) throw new Error('Setup failed');
    unit = equipResult.value;
    
    expect(unit.rank).toBe('A');
    expect(unit.subclass).toBe('Fire Adept');
    
    // Unequip gem
    unit = unequipGem(unit);
    
    // Verify rank preserved
    expect(unit.rank).toBe('A');
    
    // Verify subclass removed
    expect(unit.subclass).toBeUndefined();
    
    // Stats should reflect A rank but no class modifiers
    const stats = calculateUnitStats(unit);
    expect(stats.maxHp).toBe(130); // 100 * 1.30 (A rank only)
  });
});

