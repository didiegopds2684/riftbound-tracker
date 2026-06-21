import type { Meta, StoryObj } from '@storybook/react';
import { SegmentControl } from '../components/SegmentControl';

const modeOptions = [
  { value: '1v1', label: '1v1' },
  { value: '2v2', label: '2v2' },
];

const formatOptions = [
  { value: 'bo1', label: 'BO1' },
  { value: 'bo3', label: 'BO3' },
];

const meta: Meta<typeof SegmentControl> = {
  title: 'Componentes / SegmentControl',
  component: SegmentControl,
};
export default meta;
type Story = StoryObj<typeof SegmentControl>;

export const Modo: Story = { args: { label: 'Modo', options: modeOptions, value: '1v1', onChange: () => {} } };
export const Formato: Story = { args: { label: 'Formato', options: formatOptions, value: 'bo3', onChange: () => {} } };
export const SemLabel: Story = { args: { options: modeOptions, value: '2v2', onChange: () => {} } };
