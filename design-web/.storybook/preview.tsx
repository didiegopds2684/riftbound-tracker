import type { Preview } from '@storybook/react';
import '../src/global.css';

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: 'app',
      values: [{ name: 'app', value: '#0A0E1A' }],
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{
        width: 390,
        minHeight: 844,
        backgroundColor: '#0A0E1A',
        borderRadius: 40,
        overflow: 'hidden',
        boxShadow: '0 0 0 8px #1C2238, 0 0 40px rgba(0,0,0,0.8)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
