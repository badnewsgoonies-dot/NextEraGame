import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { GemSelectScreen } from '../../src/screens/GemSelectScreen';
import type { GemChoice } from '../../src/types/GameTypes';

describe('GemSelectScreen', () => {
  const mockGemChoices: GemChoice[] = [
    { id: 'fire_1', name: 'Fire Gem', element: 'Fire', tier: 1, boost: 10 },
    { id: 'water_2', name: 'Water Gem', element: 'Water', tier: 2, boost: 15 },
    { id: 'earth_1', name: 'Earth Gem', element: 'Earth', tier: 1, boost: 10 },
  ];

  describe('Rendering', () => {
    it('renders gem selection screen', () => {
      const onSelect = vi.fn();
      render(<GemSelectScreen gemChoices={mockGemChoices} onSelectGem={onSelect} />);

      expect(screen.getByText(/Select a Gem/i)).toBeInTheDocument();
      expect(screen.getByText(/Choose one gem to add to your inventory/i)).toBeInTheDocument();
    });

    it('displays all gem choices', () => {
      const onSelect = vi.fn();
      render(<GemSelectScreen gemChoices={mockGemChoices} onSelectGem={onSelect} />);

      expect(screen.getByText('Fire Gem')).toBeInTheDocument();
      expect(screen.getByText('Water Gem')).toBeInTheDocument();
      expect(screen.getByText('Earth Gem')).toBeInTheDocument();
    });

    it('displays gem details', () => {
      const onSelect = vi.fn();
      render(<GemSelectScreen gemChoices={mockGemChoices} onSelectGem={onSelect} />);

      // Check for element types
      expect(screen.getByText('🔥 Fire')).toBeInTheDocument();
      expect(screen.getByText('💧 Water')).toBeInTheDocument();
      expect(screen.getByText('🌍 Earth')).toBeInTheDocument();

      // Check for boost values
      expect(screen.getByText('+10 boost')).toBeInTheDocument();
      expect(screen.getByText('+15 boost')).toBeInTheDocument();
    });

    it('displays tier information', () => {
      const onSelect = vi.fn();
      render(<GemSelectScreen gemChoices={mockGemChoices} onSelectGem={onSelect} />);

      const tierElements = screen.getAllByText(/Tier/i);
      expect(tierElements.length).toBeGreaterThan(0);
    });

    it('renders select buttons for each gem', () => {
      const onSelect = vi.fn();
      render(<GemSelectScreen gemChoices={mockGemChoices} onSelectGem={onSelect} />);

      const selectButtons = screen.getAllByRole('button', { name: /Select/i });
      expect(selectButtons).toHaveLength(3);
    });
  });

  describe('Interaction', () => {
    it('calls onSelectGem when a gem is selected', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<GemSelectScreen gemChoices={mockGemChoices} onSelectGem={onSelect} />);

      const buttons = screen.getAllByRole('button', { name: /Select/i });
      await user.click(buttons[0]);

      expect(onSelect).toHaveBeenCalledTimes(1);
      expect(onSelect).toHaveBeenCalledWith(mockGemChoices[0]);
    });

    it('selects correct gem when clicking different buttons', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<GemSelectScreen gemChoices={mockGemChoices} onSelectGem={onSelect} />);

      const buttons = screen.getAllByRole('button', { name: /Select/i });
      
      await user.click(buttons[1]);
      expect(onSelect).toHaveBeenCalledWith(mockGemChoices[1]);

      await user.click(buttons[2]);
      expect(onSelect).toHaveBeenCalledWith(mockGemChoices[2]);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty gem choices array', () => {
      const onSelect = vi.fn();
      render(<GemSelectScreen gemChoices={[]} onSelectGem={onSelect} />);

      expect(screen.getByText(/Select a Gem/i)).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /Select/i })).not.toBeInTheDocument();
    });

    it('handles single gem choice', () => {
      const onSelect = vi.fn();
      const singleGem: GemChoice[] = [mockGemChoices[0]];
      render(<GemSelectScreen gemChoices={singleGem} onSelectGem={onSelect} />);

      const selectButtons = screen.getAllByRole('button', { name: /Select/i });
      expect(selectButtons).toHaveLength(1);
    });

    it('displays high-tier gems correctly', () => {
      const onSelect = vi.fn();
      const highTierGems: GemChoice[] = [
        { id: 'fire_3', name: 'Supreme Fire Gem', element: 'Fire', tier: 3, boost: 25 },
      ];
      render(<GemSelectScreen gemChoices={highTierGems} onSelectGem={onSelect} />);

      expect(screen.getByText('Supreme Fire Gem')).toBeInTheDocument();
      expect(screen.getByText('+25 boost')).toBeInTheDocument();
      expect(screen.getByText(/Tier 3/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper heading structure', () => {
      const onSelect = vi.fn();
      render(<GemSelectScreen gemChoices={mockGemChoices} onSelectGem={onSelect} />);

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent(/Select a Gem/i);
    });

    it('buttons are keyboard accessible', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<GemSelectScreen gemChoices={mockGemChoices} onSelectGem={onSelect} />);

      const buttons = screen.getAllByRole('button', { name: /Select/i });
      
      // Tab to first button and press Enter
      await user.tab();
      await user.keyboard('{Enter}');
      
      expect(onSelect).toHaveBeenCalled();
    });

    it('has descriptive button text', () => {
      const onSelect = vi.fn();
      render(<GemSelectScreen gemChoices={mockGemChoices} onSelectGem={onSelect} />);

      const buttons = screen.getAllByRole('button', { name: /Select/i });
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });
  });

  describe('Visual Consistency', () => {
    it('applies consistent styling to all gem cards', () => {
      const onSelect = vi.fn();
      const { container } = render(<GemSelectScreen gemChoices={mockGemChoices} onSelectGem={onSelect} />);

      const gemCards = container.querySelectorAll('[class*="gem-card"], [class*="card"]');
      expect(gemCards.length).toBeGreaterThan(0);
    });

    it('displays element icons consistently', () => {
      const onSelect = vi.fn();
      render(<GemSelectScreen gemChoices={mockGemChoices} onSelectGem={onSelect} />);

      // Check that each element has its icon
      expect(screen.getByText('🔥 Fire')).toBeInTheDocument();
      expect(screen.getByText('💧 Water')).toBeInTheDocument();
      expect(screen.getByText('🌍 Earth')).toBeInTheDocument();
    });
  });

  describe('Multiple Elements', () => {
    it('handles all element types', () => {
      const onSelect = vi.fn();
      const allElements: GemChoice[] = [
        { id: 'fire_1', name: 'Fire Gem', element: 'Fire', tier: 1, boost: 10 },
        { id: 'water_1', name: 'Water Gem', element: 'Water', tier: 1, boost: 10 },
        { id: 'earth_1', name: 'Earth Gem', element: 'Earth', tier: 1, boost: 10 },
        { id: 'wind_1', name: 'Wind Gem', element: 'Wind', tier: 1, boost: 10 },
      ];
      render(<GemSelectScreen gemChoices={allElements} onSelectGem={onSelect} />);

      expect(screen.getByText('🔥 Fire')).toBeInTheDocument();
      expect(screen.getByText('💧 Water')).toBeInTheDocument();
      expect(screen.getByText('🌍 Earth')).toBeInTheDocument();
      expect(screen.getByText('💨 Wind')).toBeInTheDocument();
    });
  });
});
