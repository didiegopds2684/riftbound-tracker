import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button';

const meta: Meta<typeof Button> = {
  title: 'Componentes / Button',
  component: Button,
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { label: 'Confirmar', variant: 'primary' } };
export const Secondary: Story = { args: { label: 'Cancelar', variant: 'secondary' } };
export const Danger: Story = { args: { label: 'Excluir', variant: 'danger' } };
export const Ghost: Story = { args: { label: 'Saiba mais', variant: 'ghost' } };
export const Loading: Story = { args: { label: 'Salvar', loading: true } };
export const Disabled: Story = { args: { label: 'Enviar', disabled: true } };
export const FullWidth: Story = { args: { label: 'Entrar', fullWidth: true } };
