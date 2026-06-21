import type { Meta, StoryObj } from '@storybook/react';
import { ProfileScreen } from '../screens/ProfileScreen';
import { MOCK_LEGENDS, MOCK_PROFILE } from '../mocks/data';

const meta: Meta<typeof ProfileScreen> = {
  title: 'Telas / Perfil',
  component: ProfileScreen,
  args: { legends: MOCK_LEGENDS, initialProfile: MOCK_PROFILE },
};
export default meta;
type Story = StoryObj<typeof ProfileScreen>;

export const Perfil: Story = {};
export const SemLegendFavorita: Story = {
  args: { initialProfile: { name: 'Novo Jogador', nickname: 'novato', favorite_legend_id: null } },
};
