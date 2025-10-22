/*
 * RecruitScreen Tests
 * Comprehensive tests for recruitment UI flow
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { RecruitScreen } from '../../src/screens/RecruitScreen.js';
import type { EnemyUnitTemplate, PlayerUnit } from '../../src/types/game.js';

describe('RecruitScreen', () => {
  // Test fixtures
  const createEnemy = (id: string, name: string, role: 'Tank' | 'DPS' | 'Support' | 'Specialist'): EnemyUnitTemplate => ({
    id,
    name,
    role,
    tags: ['Beast'],
    baseStats: { hp: 100, atk: 20, def: 10, speed: 15 },
  });

  const createPlayerUnit = (id: string, name: string, level: number): PlayerUnit => ({
    id,
    name,
    role: 'Tank',
    tags: ['Holy'],
    hp: 150,
    maxHp: 150,
    atk: 25,
    def: 20,
    speed: 10,
    level,
    experience: 100,
  });

  const mockHandlers = {
    onRecruit: vi.fn(),
    onSkip: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering - Basic Layout', () => {
    test('renders header with title', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam: PlayerUnit[] = [];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Recruit Defeated Unit')).toBeInTheDocument();
    });

    test('renders all defeated enemies', () => {
      const defeatedEnemies = [
        createEnemy('orc', 'Orc Warrior', 'Tank'),
        createEnemy('goblin', 'Goblin Scout', 'DPS'),
        createEnemy('troll', 'Troll Berserker', 'Specialist'),
      ];
      const currentTeam: PlayerUnit[] = [];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Orc Warrior')).toBeInTheDocument();
      expect(screen.getByText('Goblin Scout')).toBeInTheDocument();
      expect(screen.getByText('Troll Berserker')).toBeInTheDocument();
    });

    test('displays enemy stats (HP, ATK, DEF, SPD)', () => {
      const enemy: EnemyUnitTemplate = {
        id: 'dragon',
        name: 'Dragon',
        role: 'Specialist',
        tags: ['Arcane'],
        baseStats: { hp: 200, atk: 50, def: 30, speed: 25 },
      };
      const currentTeam: PlayerUnit[] = [];

      render(
        <RecruitScreen
          defeatedEnemies={[enemy]}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('200')).toBeInTheDocument(); // HP
      expect(screen.getByText('50')).toBeInTheDocument(); // ATK
      expect(screen.getByText('30')).toBeInTheDocument(); // DEF
      expect(screen.getByText('25')).toBeInTheDocument(); // SPD
    });

    test('displays enemy role', () => {
      const defeatedEnemies = [
        createEnemy('orc', 'Orc Warrior', 'Tank'),
        createEnemy('goblin', 'Goblin Scout', 'DPS'),
      ];
      const currentTeam: PlayerUnit[] = [];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      // Should see role text for each enemy
      const roles = screen.getAllByText(/Tank|DPS/);
      expect(roles.length).toBeGreaterThanOrEqual(2);
    });

    test('displays enemy tags', () => {
      const enemy: EnemyUnitTemplate = {
        id: 'wizard',
        name: 'Wizard',
        role: 'Support',
        tags: ['Arcane', 'Nature'],
        baseStats: { hp: 80, atk: 30, def: 5, speed: 20 },
      };
      const currentTeam: PlayerUnit[] = [];

      render(
        <RecruitScreen
          defeatedEnemies={[enemy]}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Arcane')).toBeInTheDocument();
      expect(screen.getByText('Nature')).toBeInTheDocument();
    });

    test('displays Skip Recruitment button', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam: PlayerUnit[] = [];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Skip Recruitment')).toBeInTheDocument();
    });

    test('displays current team size', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1', 5),
        createPlayerUnit('hero2', 'Hero 2', 3),
      ];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      expect(screen.getByText(/Current team: 2\/4 units/)).toBeInTheDocument();
    });
  });

  describe('Team Not Full - Direct Recruitment', () => {
    test('Recruit button triggers onRecruit with enemy ID (team < 4)', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam = [createPlayerUnit('hero1', 'Hero 1', 5)];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      expect(mockHandlers.onRecruit).toHaveBeenCalledWith('orc');
    });

    test('does not show replacement modal when team not full', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam = [createPlayerUnit('hero1', 'Hero 1', 5)];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      // Modal should not appear
      expect(screen.queryByText('Choose Unit to Replace')).not.toBeInTheDocument();
    });

    test('shows standard recruitment message when team not full', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam: PlayerUnit[] = [];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('You may recruit one defeated enemy.')).toBeInTheDocument();
      expect(screen.queryByText(/Your roster is full/)).not.toBeInTheDocument();
    });

    test('can recruit multiple different enemies in sequence (simulation)', () => {
      const defeatedEnemies = [
        createEnemy('orc', 'Orc Warrior', 'Tank'),
        createEnemy('goblin', 'Goblin Scout', 'DPS'),
      ];
      const currentTeam = [createPlayerUnit('hero1', 'Hero 1', 5)];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      const recruitButtons = screen.getAllByRole('button', { name: 'Recruit' });
      
      // Recruit first enemy
      fireEvent.click(recruitButtons[0]);
      expect(mockHandlers.onRecruit).toHaveBeenCalledWith('orc');

      // Reset and recruit second enemy
      mockHandlers.onRecruit.mockClear();
      fireEvent.click(recruitButtons[1]);
      expect(mockHandlers.onRecruit).toHaveBeenCalledWith('goblin');
    });
  });

  describe('Team Full - Replacement Modal', () => {
    test('shows replacement modal when recruiting with full team', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1', 5),
        createPlayerUnit('hero2', 'Hero 2', 3),
        createPlayerUnit('hero3', 'Hero 3', 7),
        createPlayerUnit('hero4', 'Hero 4', 2),
      ];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      expect(screen.getByText('Choose Unit to Replace')).toBeInTheDocument();
    });

    test('displays warning when roster is full', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1', 5),
        createPlayerUnit('hero2', 'Hero 2', 3),
        createPlayerUnit('hero3', 'Hero 3', 7),
        createPlayerUnit('hero4', 'Hero 4', 2),
      ];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      expect(screen.getByText(/Your roster is full - choose a unit to replace/)).toBeInTheDocument();
    });

    test('replacement modal shows all current team members', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1', 5),
        createPlayerUnit('hero2', 'Hero 2', 3),
        createPlayerUnit('hero3', 'Hero 3', 7),
        createPlayerUnit('hero4', 'Hero 4', 2),
      ];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      // All team members should be visible in modal
      expect(screen.getByText('Hero 1')).toBeInTheDocument();
      expect(screen.getByText('Hero 2')).toBeInTheDocument();
      expect(screen.getByText('Hero 3')).toBeInTheDocument();
      expect(screen.getByText('Hero 4')).toBeInTheDocument();
    });

    test('replacement modal displays unit levels', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1', 5),
        createPlayerUnit('hero2', 'Hero 2', 10),
        createPlayerUnit('hero3', 'Hero 3', 7),
        createPlayerUnit('hero4', 'Hero 4', 2),
      ];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      expect(screen.getByText(/Lv 5/)).toBeInTheDocument();
      expect(screen.getByText(/Lv 10/)).toBeInTheDocument();
      expect(screen.getByText(/Lv 7/)).toBeInTheDocument();
      expect(screen.getByText(/Lv 2/)).toBeInTheDocument();
    });

    test('selecting unit to replace calls onRecruit with both IDs', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1', 5),
        createPlayerUnit('hero2', 'Hero 2', 3),
        createPlayerUnit('hero3', 'Hero 3', 7),
        createPlayerUnit('hero4', 'Hero 4', 2),
      ];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      // Open modal
      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      // Click on Hero 2 in modal
      const hero2Button = screen.getByText('Hero 2').closest('button');
      expect(hero2Button).toBeInTheDocument();
      fireEvent.click(hero2Button!);

      expect(mockHandlers.onRecruit).toHaveBeenCalledWith('orc', 'hero2');
    });

    test('replacement modal closes after selecting unit', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1', 5),
        createPlayerUnit('hero2', 'Hero 2', 3),
        createPlayerUnit('hero3', 'Hero 3', 7),
        createPlayerUnit('hero4', 'Hero 4', 2),
      ];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      // Open modal
      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      // Select unit
      const hero1Button = screen.getByText('Hero 1').closest('button');
      fireEvent.click(hero1Button!);

      // Modal should close
      expect(screen.queryByText('Choose Unit to Replace')).not.toBeInTheDocument();
    });

    test('Cancel button closes replacement modal', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1', 5),
        createPlayerUnit('hero2', 'Hero 2', 3),
        createPlayerUnit('hero3', 'Hero 3', 7),
        createPlayerUnit('hero4', 'Hero 4', 2),
      ];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      // Open modal
      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      // Click Cancel
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      fireEvent.click(cancelButton);

      // Modal should close
      expect(screen.queryByText('Choose Unit to Replace')).not.toBeInTheDocument();
    });

    test('canceling modal does not call onRecruit', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1', 5),
        createPlayerUnit('hero2', 'Hero 2', 3),
        createPlayerUnit('hero3', 'Hero 3', 7),
        createPlayerUnit('hero4', 'Hero 4', 2),
      ];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      // Open modal
      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      // Cancel
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      fireEvent.click(cancelButton);

      expect(mockHandlers.onRecruit).not.toHaveBeenCalled();
    });
  });

  describe('Skip Functionality', () => {
    test('Skip button calls onSkip', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam: PlayerUnit[] = [];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      const skipButton = screen.getByRole('button', { name: 'Skip Recruitment' });
      fireEvent.click(skipButton);

      expect(mockHandlers.onSkip).toHaveBeenCalledOnce();
    });

    test('Skip works with full team', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1', 5),
        createPlayerUnit('hero2', 'Hero 2', 3),
        createPlayerUnit('hero3', 'Hero 3', 7),
        createPlayerUnit('hero4', 'Hero 4', 2),
      ];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      const skipButton = screen.getByRole('button', { name: 'Skip Recruitment' });
      fireEvent.click(skipButton);

      expect(mockHandlers.onSkip).toHaveBeenCalledOnce();
    });

    test('Skip does not trigger onRecruit', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam: PlayerUnit[] = [];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      const skipButton = screen.getByRole('button', { name: 'Skip Recruitment' });
      fireEvent.click(skipButton);

      expect(mockHandlers.onRecruit).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    test('handles empty defeated enemies list', () => {
      const defeatedEnemies: EnemyUnitTemplate[] = [];
      const currentTeam: PlayerUnit[] = [];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      // Should still render header and skip button
      expect(screen.getByText('Recruit Defeated Unit')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Skip Recruitment' })).toBeInTheDocument();
    });

    test('handles enemy with no tags', () => {
      const enemy: EnemyUnitTemplate = {
        id: 'minimal',
        name: 'Minimal Enemy',
        role: 'DPS',
        tags: [],
        baseStats: { hp: 1, atk: 1, def: 1, speed: 1 },
      };
      const currentTeam: PlayerUnit[] = [];

      render(
        <RecruitScreen
          defeatedEnemies={[enemy]}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      expect(screen.getByText('Minimal Enemy')).toBeInTheDocument();
    });

    test('handles empty team', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam: PlayerUnit[] = [];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      expect(screen.getByText(/Current team: 0\/4 units/)).toBeInTheDocument();
    });

    test('handles exactly 4 units (edge of full)', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1', 5),
        createPlayerUnit('hero2', 'Hero 2', 3),
        createPlayerUnit('hero3', 'Hero 3', 7),
        createPlayerUnit('hero4', 'Hero 4', 2),
      ];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      expect(screen.getByText(/Current team: 4\/4 units/)).toBeInTheDocument();
      expect(screen.getByText(/Your roster is full/)).toBeInTheDocument();
    });

    test('handles single defeated enemy', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam: PlayerUnit[] = [];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      expect(screen.getAllByRole('button', { name: 'Recruit' })).toHaveLength(1);
    });

    test('handles multiple defeated enemies with same name', () => {
      const defeatedEnemies = [
        createEnemy('orc1', 'Orc Warrior', 'Tank'),
        createEnemy('orc2', 'Orc Warrior', 'Tank'),
        createEnemy('orc3', 'Orc Warrior', 'DPS'),
      ];
      const currentTeam: PlayerUnit[] = [];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      const orcWarriors = screen.getAllByText('Orc Warrior');
      expect(orcWarriors).toHaveLength(3);
    });

    test('replacement modal handles different roles correctly', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam = [
        { ...createPlayerUnit('hero1', 'Tank Hero', 5), role: 'Tank' as const },
        { ...createPlayerUnit('hero2', 'DPS Hero', 3), role: 'DPS' as const },
        { ...createPlayerUnit('hero3', 'Support Hero', 7), role: 'Support' as const },
        { ...createPlayerUnit('hero4', 'Specialist Hero', 2), role: 'Specialist' as const },
      ];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      // Open modal
      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      // All roles should be visible
      expect(screen.getByText(/Tank Hero/)).toBeInTheDocument();
      expect(screen.getByText(/DPS Hero/)).toBeInTheDocument();
      expect(screen.getByText(/Support Hero/)).toBeInTheDocument();
      expect(screen.getByText(/Specialist Hero/)).toBeInTheDocument();
    });
  });

  describe('Multiple Recruitment Scenarios', () => {
    test('can open replacement modal for different enemies', () => {
      const defeatedEnemies = [
        createEnemy('orc', 'Orc Warrior', 'Tank'),
        createEnemy('goblin', 'Goblin Scout', 'DPS'),
      ];
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1', 5),
        createPlayerUnit('hero2', 'Hero 2', 3),
        createPlayerUnit('hero3', 'Hero 3', 7),
        createPlayerUnit('hero4', 'Hero 4', 2),
      ];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      const recruitButtons = screen.getAllByRole('button', { name: 'Recruit' });

      // Try first enemy
      fireEvent.click(recruitButtons[0]);
      expect(screen.getByText('Choose Unit to Replace')).toBeInTheDocument();

      // Cancel
      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      fireEvent.click(cancelButton);

      // Try second enemy
      fireEvent.click(recruitButtons[1]);
      expect(screen.getByText('Choose Unit to Replace')).toBeInTheDocument();
    });

    test('remembers selected enemy when opening replacement modal', () => {
      const defeatedEnemies = [
        createEnemy('orc', 'Orc Warrior', 'Tank'),
        createEnemy('goblin', 'Goblin Scout', 'DPS'),
      ];
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1', 5),
        createPlayerUnit('hero2', 'Hero 2', 3),
        createPlayerUnit('hero3', 'Hero 3', 7),
        createPlayerUnit('hero4', 'Hero 4', 2),
      ];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      const recruitButtons = screen.getAllByRole('button', { name: 'Recruit' });

      // Select goblin
      fireEvent.click(recruitButtons[1]);

      // Select replacement
      const hero3Button = screen.getByText('Hero 3').closest('button');
      fireEvent.click(hero3Button!);

      // Should recruit goblin (not orc)
      expect(mockHandlers.onRecruit).toHaveBeenCalledWith('goblin', 'hero3');
    });
  });

  describe('UI State Management', () => {
    test('displays team size correctly at 0/4', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam: PlayerUnit[] = [];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      expect(screen.getByText(/Current team: 0\/4 units/)).toBeInTheDocument();
    });

    test('displays team size correctly at 3/4', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1', 5),
        createPlayerUnit('hero2', 'Hero 2', 3),
        createPlayerUnit('hero3', 'Hero 3', 7),
      ];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      expect(screen.getByText(/Current team: 3\/4 units/)).toBeInTheDocument();
    });

    test('replacement modal has proper backdrop', () => {
      const defeatedEnemies = [createEnemy('orc', 'Orc Warrior', 'Tank')];
      const currentTeam = [
        createPlayerUnit('hero1', 'Hero 1', 5),
        createPlayerUnit('hero2', 'Hero 2', 3),
        createPlayerUnit('hero3', 'Hero 3', 7),
        createPlayerUnit('hero4', 'Hero 4', 2),
      ];

      render(
        <RecruitScreen
          defeatedEnemies={defeatedEnemies}
          currentTeam={currentTeam}
          {...mockHandlers}
        />
      );

      const recruitButton = screen.getByRole('button', { name: 'Recruit' });
      fireEvent.click(recruitButton);

      // Modal should be visible with proper backdrop styling
      const modal = screen.getByText('Choose Unit to Replace').closest('div');
      expect(modal).toBeInTheDocument();
    });
  });
});
