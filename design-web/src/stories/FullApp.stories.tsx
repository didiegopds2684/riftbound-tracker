import type { Meta, StoryObj } from '@storybook/react';
import { FullApp } from '../screens/FullApp';

const meta: Meta<typeof FullApp> = {
  title: 'App / App Completo',
  component: FullApp,
};
export default meta;
type Story = StoryObj<typeof FullApp>;

export const AppCompleto: Story = {};
