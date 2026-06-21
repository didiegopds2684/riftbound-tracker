import type { Meta, StoryObj } from '@storybook/react';
import { LegendPicker } from '../components/LegendPicker';
import { MOCK_LEGENDS } from '../mocks/data';

const meta: Meta<typeof LegendPicker> = {
  title: 'Componentes / LegendPicker',
  component: LegendPicker,
  args: { legends: MOCK_LEGENDS, onChange: () => {} },
};
export default meta;
type Story = StoryObj<typeof LegendPicker>;

export const Vazio: Story = { args: { value: null } };
export const Selecionado: Story = { args: { value: MOCK_LEGENDS[0].id } };
