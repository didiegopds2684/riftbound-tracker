import type { Meta, StoryObj } from '@storybook/react';
import { AuthScreen } from '../screens/AuthScreen';

const meta: Meta<typeof AuthScreen> = {
  title: 'Telas / Auth',
  component: AuthScreen,
};
export default meta;
type Story = StoryObj<typeof AuthScreen>;

export const Login: Story = {};
