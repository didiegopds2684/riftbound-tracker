import type { Meta, StoryObj } from '@storybook/react';
import { LegendAvatar } from '../components/LegendAvatar';
import { MOCK_LEGENDS } from '../mocks/data';

const meta: Meta<typeof LegendAvatar> = {
  title: 'Componentes / LegendAvatar',
  component: LegendAvatar,
  args: { legend: MOCK_LEGENDS[0] },
};
export default meta;
type Story = StoryObj<typeof LegendAvatar>;

export const Default: Story = {};
export const WithName: Story = { args: { showName: true } };
export const Large: Story = { args: { size: 80, showName: true } };
export const Small: Story = { args: { size: 28 } };
export const Fallback: Story = { args: { legend: undefined } };
export const BodyDomain: Story = { args: { legend: MOCK_LEGENDS[6], showName: true } };
export const ChaosDomain: Story = { args: { legend: MOCK_LEGENDS[4], showName: true } };
