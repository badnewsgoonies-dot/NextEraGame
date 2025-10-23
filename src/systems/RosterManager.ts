/*
 * RosterManager: Manage player roster (active party + bench)
 *
 * Features:
 * - Split team into active party (max 4) and bench (unlimited)
 * - Swap units between active party and bench
 * - Validate roster composition
 * - Maintain immutability (no mutations)
 */

import type { PlayerUnit, RosterData, RosterSwap } from '../types/game.js';
import { ok, err, type Result } from '../utils/Result.js';

export class RosterManager {
  private readonly maxActiveSize = 4;

  /**
   * Create roster from flat player team
   * First 4 units go to active party, rest to bench
   */
  createRosterFromTeam(team: readonly PlayerUnit[]): RosterData {
    return {
      activeParty: team.slice(0, this.maxActiveSize),
      bench: team.slice(this.maxActiveSize),
    };
  }

  /**
   * Get active team as flat array (for battle system compatibility)
   */
  getActiveTeam(roster: RosterData): readonly PlayerUnit[] {
    return roster.activeParty;
  }

  /**
   * Get all units (active + bench) as flat array
   */
  getAllUnits(roster: RosterData): readonly PlayerUnit[] {
    return [...roster.activeParty, ...roster.bench];
  }

  /**
   * Swap a unit from bench to active party and vice versa
   * Returns new roster (immutable) or error
   */
  swapUnits(roster: RosterData, swap: RosterSwap): Result<RosterData, string> {
    // Find bench unit
    const benchIndex = roster.bench.findIndex(u => u.id === swap.benchUnitId);
    if (benchIndex === -1) {
      return err(`Bench unit ${swap.benchUnitId} not found`);
    }

    // Find active unit
    const activeIndex = roster.activeParty.findIndex(u => u.id === swap.activeUnitId);
    if (activeIndex === -1) {
      return err(`Active unit ${swap.activeUnitId} not found`);
    }

    // Perform swap (immutably)
    const benchUnit = roster.bench[benchIndex];
    const activeUnit = roster.activeParty[activeIndex];

    const newActiveParty = [...roster.activeParty];
    newActiveParty[activeIndex] = benchUnit;

    const newBench = [...roster.bench];
    newBench[benchIndex] = activeUnit;

    return ok({
      activeParty: newActiveParty,
      bench: newBench,
    });
  }

  /**
   * Add a newly recruited unit to the roster
   * If active party has room, adds to active party
   * Otherwise adds to bench
   */
  addRecruitedUnit(roster: RosterData, unit: PlayerUnit): RosterData {
    if (roster.activeParty.length < this.maxActiveSize) {
      return {
        activeParty: [...roster.activeParty, unit],
        bench: roster.bench,
      };
    }

    return {
      activeParty: roster.activeParty,
      bench: [...roster.bench, unit],
    };
  }

  /**
   * Validate roster composition
   * Rules:
   * - Active party cannot be empty
   * - Active party cannot exceed 4 units
   * - No duplicate unit IDs across active + bench
   */
  validateRoster(roster: RosterData): Result<void, string> {
    // Check active party not empty
    if (roster.activeParty.length === 0) {
      return err('Active party cannot be empty');
    }

    // Check active party size
    if (roster.activeParty.length > this.maxActiveSize) {
      return err('Active party cannot exceed 4 units');
    }

    // Check for duplicate IDs
    const allUnits = this.getAllUnits(roster);
    const uniqueIds = new Set(allUnits.map(u => u.id));
    if (uniqueIds.size !== allUnits.length) {
      return err('Duplicate unit IDs found in roster');
    }

    return ok(undefined);
  }

  /**
   * Get roster statistics
   */
  getRosterStats(roster: RosterData): {
    activeCount: number;
    benchCount: number;
    totalCount: number;
    activeSlotsFree: number;
    hasFullActiveParty: boolean;
  } {
    return {
      activeCount: roster.activeParty.length,
      benchCount: roster.bench.length,
      totalCount: roster.activeParty.length + roster.bench.length,
      activeSlotsFree: Math.max(0, this.maxActiveSize - roster.activeParty.length),
      hasFullActiveParty: roster.activeParty.length >= this.maxActiveSize,
    };
  }
}
