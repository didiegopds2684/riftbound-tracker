import type { Meta, StoryObj } from '@storybook/react';
import { ResultBadge } from '../components/ResultBadge';

const meta: Meta<typeof ResultBadge> = {
  title: 'Componentes / ResultBadge',
  component: ResultBadge,
};
export default meta;
type Story = StoryObj<typeof ResultBadge>;

export const Win: Story = { args: { result: 'win' } };
export const Loss: Story = { args: { result: 'loss' } };
export const Draw: Story = { args: { result: 'draw' } };
