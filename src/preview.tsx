import type { Preview } from '@storybook/react';
import '../styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0F172A',
        },
        {
          name: 'light',
          value: '#ffffff',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
    },
    docs: {
      theme: {
        base: 'dark',
        brandTitle: 'FlashFusion Design System',
        brandUrl: 'https://flashfusion.dev',
        colorPrimary: '#FF7B00',
        colorSecondary: '#00B4D8',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="dark bg-background text-foreground min-h-screen p-8">
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default preview;