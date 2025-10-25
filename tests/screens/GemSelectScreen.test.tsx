/*
 * GemSelectScreen Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { GemSelectScreen } from '../../src/screens/GemSelectScreen';

describe('GemSelectScreen', () => {
  describe('Rendering', () => {
    it('renders gem choices', () => {
      const gemChoices = ['ruby_gem', 'sapphire_gem'];
      render(
        <GemSelectScreen
          gemChoices={gemChoices}
          onSelect={vi.fn()}
        />
      );

      expect(screen.getByText(/Choose Your Gem/i)).toBeInTheDocument();
      expect(screen.getByText('Ruby Gem')).toBeInTheDocument();
      expect(screen.getByText('Sapphire Gem')).toBeInTheDocument();
    });

    it('displays gem descriptions and stats', () => {
      const gemChoices = ['emerald_gem'];
      render(
        <GemSelectScreen
          gemChoices={gemChoices}
          onSelect={vi.fn()}
        />
      );

      expect(screen.getByText('Emerald Gem')).toBeInTheDocument();
      expect(screen.getByText('Earth Adept')).toBeInTheDocument();
      expect(screen.getByText(/verdant gem solid as stone/i)).toBeInTheDocument();
    });

    it('shows passive bonuses', () => {
      const gemChoices = ['ruby_gem'];
      render(
        <GemSelectScreen
          gemChoices={gemChoices}
          onSelect={vi.fn()}
        />
      );

      expect(screen.getByText('PASSIVE BONUS (When Active)')).toBeInTheDocument();
      expect(screen.getByText('+5 ATK')).toBeInTheDocument();
    });

    it('shows granted ability', () => {
      const gemChoices = ['ruby_gem'];
      render(
        <GemSelectScreen
          gemChoices={gemChoices}
          onSelect={vi.fn()}
        />
      );

      expect(screen.getByText('GRANTED ABILITY')).toBeInTheDocument();
      expect(screen.getByText('Fireball (20 MP)')).toBeInTheDocument();
    });

    it('shows gem effect', () => {
      const gemChoices = ['ruby_gem'];
      render(
        <GemSelectScreen
          gemChoices={gemChoices}
          onSelect={vi.fn()}
        />
      );

      expect(screen.getByText('GEM EFFECT (One-time)')).toBeInTheDocument();
      expect(screen.getByText('DAMAGE - Power 50')).toBeInTheDocument();
    });
  });

  describe('No Gems Available', () => {
    it('shows message when no gems offered', () => {
      render(
        <GemSelectScreen
          gemChoices={[]}
          onSelect={vi.fn()}
          onSkip={vi.fn()}
        />
      );

      expect(screen.getByText('No gems were offered this time.')).toBeInTheDocument();
    });

    it('calls onSkip when continue clicked with no gems', async () => {
      const user = userEvent.setup();
      const onSkip = vi.fn();
      
      render(
        <GemSelectScreen
          gemChoices={[]}
          onSelect={vi.fn()}
          onSkip={onSkip}
        />
      );

      const continueBtn = screen.getByRole('button', { name: /continue/i });
      await user.click(continueBtn);

      expect(onSkip).toHaveBeenCalledOnce();
    });
  });

  describe('Selection', () => {
    it('allows selecting a gem', async () => {
      const user = userEvent.setup();
      const gemChoices = ['ruby_gem', 'sapphire_gem'];
      
      render(
        <GemSelectScreen
          gemChoices={gemChoices}
          onSelect={vi.fn()}
        />
      );

      const rubyCard = screen.getByRole('button', { name: 'Select Ruby Gem' });
      await user.click(rubyCard);

      expect(screen.getByText('✓')).toBeInTheDocument();
      expect(screen.getByText('Selected')).toBeInTheDocument();
    });

    it('updates selection button text when gem selected', async () => {
      const user = userEvent.setup();
      const gemChoices = ['ruby_gem', 'sapphire_gem'];
      
      render(
        <GemSelectScreen
          gemChoices={gemChoices}
          onSelect={vi.fn()}
        />
      );

      const rubyCard = screen.getByRole('button', { name: 'Select Ruby Gem' });
      await user.click(rubyCard);

      expect(screen.getByText('Select Ruby Gem')).toBeInTheDocument();
    });

    it('calls onSelect with selected gem ID', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      const gemChoices = ['ruby_gem', 'sapphire_gem'];
      
      render(
        <GemSelectScreen
          gemChoices={gemChoices}
          onSelect={onSelect}
        />
      );

      // Select ruby
      const rubyCard = screen.getByRole('button', { name: 'Select Ruby Gem' });
      await user.click(rubyCard);

      // Confirm selection using aria-label
      const confirmBtn = screen.getByRole('button', { name: 'Confirm gem selection' });
      await user.click(confirmBtn);

      expect(onSelect).toHaveBeenCalledWith('ruby_gem');
    });

    it('disables select button when no gem selected', () => {
      const gemChoices = ['ruby_gem'];
      
      render(
        <GemSelectScreen
          gemChoices={gemChoices}
          onSelect={vi.fn()}
        />
      );

      const selectBtn = screen.getByText('Select a Gem');
      expect(selectBtn).toBeDisabled();
    });

    it('can change selection', async () => {
      const user = userEvent.setup();
      const gemChoices = ['ruby_gem', 'sapphire_gem'];
      
      render(
        <GemSelectScreen
          gemChoices={gemChoices}
          onSelect={vi.fn()}
        />
      );

      // Select ruby first
      const rubyCard = screen.getByRole('button', { name: 'Select Ruby Gem' });
      await user.click(rubyCard);
      expect(screen.getByText('Select Ruby Gem')).toBeInTheDocument();

      // Change to sapphire
      const sapphireCard = screen.getByRole('button', { name: 'Select Sapphire Gem' });
      await user.click(sapphireCard);
      expect(screen.getByText('Select Sapphire Gem')).toBeInTheDocument();
    });
  });

  describe('Multiple Gems', () => {
    it('renders all gem choices', () => {
      const gemChoices = ['ruby_gem', 'sapphire_gem', 'emerald_gem'];
      
      render(
        <GemSelectScreen
          gemChoices={gemChoices}
          onSelect={vi.fn()}
        />
      );

      expect(screen.getByText('Ruby Gem')).toBeInTheDocument();
      expect(screen.getByText('Sapphire Gem')).toBeInTheDocument();
      expect(screen.getByText('Emerald Gem')).toBeInTheDocument();
    });

    it('only one gem can be selected at a time', async () => {
      const user = userEvent.setup();
      const gemChoices = ['ruby_gem', 'sapphire_gem'];
      
      render(
        <GemSelectScreen
          gemChoices={gemChoices}
          onSelect={vi.fn()}
        />
      );

      // Select ruby
      const rubyCard = screen.getByRole('button', { name: 'Select Ruby Gem' });
      await user.click(rubyCard);

      // Select sapphire
      const sapphireCard = screen.getByRole('button', { name: 'Select Sapphire Gem' });
      await user.click(sapphireCard);

      // Only sapphire should show as selected
      const selectedIndicators = screen.getAllByText('✓');
      expect(selectedIndicators).toHaveLength(1);
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports Enter key for selection', async () => {
      const user = userEvent.setup();
      const gemChoices = ['ruby_gem'];
      
      render(
        <GemSelectScreen
          gemChoices={gemChoices}
          onSelect={vi.fn()}
        />
      );

      const rubyCard = screen.getByRole('button', { name: 'Select Ruby Gem' });
      rubyCard.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('supports Space key for selection', async () => {
      const user = userEvent.setup();
      const gemChoices = ['ruby_gem'];
      
      render(
        <GemSelectScreen
          gemChoices={gemChoices}
          onSelect={vi.fn()}
        />
      );

      const rubyCard = screen.getByRole('button', { name: 'Select Ruby Gem' });
      rubyCard.focus();
      await user.keyboard(' ');

      expect(screen.getByText('✓')).toBeInTheDocument();
    });
  });
});
