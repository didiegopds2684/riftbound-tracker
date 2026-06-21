import type { Meta, StoryObj } from '@storybook/react';
import { FormField } from '../components/FormField';

const meta: Meta<typeof FormField> = {
  title: 'Componentes / FormField',
  component: FormField,
};
export default meta;
type Story = StoryObj<typeof FormField>;

export const Default: Story = { args: { label: 'Nome', placeholder: 'Digite seu nome...' } };
export const WithValue: Story = { args: { label: 'Nickname', value: 'diegosantos', onChange: () => {} } };
export const WithError: Story = { args: { label: 'Email', value: 'invalido', error: 'Email inválido', onChange: () => {} } };
export const Multiline: Story = { args: { label: 'Observações', multiline: true, placeholder: 'Escreva aqui...' } };
