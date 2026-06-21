import type { Meta, StoryObj } from '@storybook/react';
import { NewMatchScreen } from '../screens/NewMatchScreen';
import { MOCK_LEGENDS } from '../mocks/data';

const meta: Meta<typeof NewMatchScreen> = {
  title: 'Telas / Nova Partida',
  component: NewMatchScreen,
  args: { legends: MOCK_LEGENDS, onDone: () => {} },
};
export default meta;
type Story = StoryObj<typeof NewMatchScreen>;

export const Formulario: Story = {};
