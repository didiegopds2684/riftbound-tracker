import type { Meta, StoryObj } from '@storybook/react';
import { MatchesScreen } from '../screens/MatchesScreen';
import { MOCK_LEGENDS, MOCK_MATCHES } from '../mocks/data';

const meta: Meta<typeof MatchesScreen> = {
  title: 'Telas / Partidas',
  component: MatchesScreen,
  args: { legends: MOCK_LEGENDS },
};
export default meta;
type Story = StoryObj<typeof MatchesScreen>;

export const ComPartidas: Story = { args: { initialMatches: MOCK_MATCHES } };
export const Vazio: Story = { args: { initialMatches: [] } };
