/*
 * RosterManager: Manage player roster (active party + bench)
 * 
 * Features:
 * - Separate active combat team (max 4) from bench reserves (unlimited)
 * - Swap units between active and bench
 * - Validate roster composition
 * - Add recruited units to appropriate location
 */

import type { PlayerUnit, RosterData, RosterSwap } from '../types/game.js';
import { ok, err, type Result } from '../utils/Result.js';

export class RosterManager {
  private readonly maxActiveSize = 4;

  /**
   * Create roster from flat team array
   * First 4 units go to active party, rest to bench
   */
  createRosterFromTeam(team: readonly PlayerUnit[]): RosterData {
    return {
      activeParty: team.slice(0, this.maxActiveSize),
      bench: team.slice(this.maxActiveSize),
    };
  }

  /**
   * Get active team as flat array (for battle system)
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
   * Swap one unit from bench to active and vice versa
   * Returns new roster (immutable operation)
   */
  swapUnits(
    roster: RosterData,
    swap: RosterSwap
  ): Result<RosterData, string> {
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

    // Get the units
    const benchUnit = roster.bench[benchIndex];
    const activeUnit = roster.activeParty[activeIndex];

    // Create new arrays with swapped positions (immutable)
    const newBench = [...roster.bench];
    newBench[benchIndex] = activeUnit;

    const newActive = [...roster.activeParty];
    newActive[activeIndex] = benchUnit;

    return ok({
      activeParty: newActive,
      bench: newBench,
    });
  }

  /**
   * Add newly recruited unit to roster
   * If active party not full, add there; otherwise add to bench
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
   * Checks: active party not empty, active party <= 4, no duplicate IDs
   */
  validateRoster(roster: RosterData): Result<void, string> {
    // Check active party not empty
    if (roster.activeParty.length === 0) {
      return err('Active party cannot be empty');
    }

    // Check active party size
    if (roster.activeParty.length > this.maxActiveSize) {
      return err(`Active party cannot exceed ${this.maxActiveSize} units`);
    }

    // Check for duplicate IDs across active + bench
    const allIds = new Set<string>();
    const allUnits = [...roster.activeParty, ...roster.bench];

    for (const unit of allUnits) {
      if (allIds.has(unit.id)) {
        return err(`Duplicate unit ID found: ${unit.id}`);
      }
      allIds.add(unit.id);
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
    hasFullActiveParty: boolean;
  } {
    return {
      activeCount: roster.activeParty.length,
      benchCount: roster.bench.length,
      totalCount: roster.activeParty.length + roster.bench.length,
      hasFullActiveParty: roster.activeParty.length === this.maxActiveSize,
    };
  }
}
