import type { Meta, StoryObj } from '@storybook/react';
import { LegendsScreen } from '../screens/LegendsScreen';
import { MOCK_LEGENDS, MOCK_MATCHES } from '../mocks/data';

const meta: Meta<typeof LegendsScreen> = {
  title: 'Telas / Legends',
  component: LegendsScreen,
  args: { legends: MOCK_LEGENDS },
};
export default meta;
type Story = StoryObj<typeof LegendsScreen>;

export const ComEstatisticas: Story = { args: { matches: MOCK_MATCHES } };
export const Vazio: Story = { args: { matches: [] } };
