import type { Meta, StoryObj } from '@storybook/react';
import { MatchCounterScreen } from '../screens/MatchCounterScreen';

const meta: Meta<typeof MatchCounterScreen> = {
  title: 'Telas / Placar',
  component: MatchCounterScreen,
};
export default meta;
type Story = StoryObj<typeof MatchCounterScreen>;

export const Setup: Story = {};
