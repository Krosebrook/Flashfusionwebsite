import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Button } from './button';
import { Download, ArrowRight, Plus, Trash2 } from 'lucide-react';

const meta: Meta<typeof Button> = {
  title: 'FlashFusion/UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'FlashFusion primary button component with multiple variants and animations. Features hover effects, gradients, and accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: 'Visual variant of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Size of the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
  },
  args: {
    onClick: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Primary: Story = {
  args: {
    children: 'Create Project',
    className: 'ff-btn-primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Primary button with FlashFusion gradient and glow effects on hover.',
      },
    },
  },
};

export const Secondary: Story = {
  args: {
    children: 'Deploy Now',
    className: 'ff-btn-secondary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Secondary button with cyan gradient styling.',
      },
    },
  },
};

export const Accent: Story = {
  args: {
    children: 'Premium Feature',
    className: 'ff-btn-accent',
  },
  parameters: {
    docs: {
      description: {
        story: 'Accent button with magenta gradient for special actions.',
      },
    },
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Download className="w-4 h-4 mr-2" />
        Download
      </>
    ),
    className: 'ff-btn-primary',
  },
};

export const IconOnly: Story = {
  args: {
    size: 'icon',
    children: <Plus className="w-4 h-4" />,
    className: 'ff-btn-primary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Project
      </>
    ),
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Cancel',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Processing...',
    disabled: true,
    className: 'ff-btn-primary',
  },
};

export const Loading: Story = {
  args: {
    children: (
      <>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        Loading...
      </>
    ),
    disabled: true,
    className: 'ff-btn-primary',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button in loading state with spinner animation.',
      },
    },
  },
};

export const AnimatedHover: Story = {
  args: {
    children: (
      <>
        Get Started
        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
      </>
    ),
    className: 'ff-btn-primary group ff-hover-glow',
  },
  parameters: {
    docs: {
      description: {
        story: 'Button with animated icon that moves on hover.',
      },
    },
  },
};

// Showcase all variants
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button className="ff-btn-primary">Primary</Button>
      <Button className="ff-btn-secondary">Secondary</Button>
      <Button className="ff-btn-accent">Accent</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button variants in one view.',
      },
    },
  },
};

// Showcase all sizes
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm" className="ff-btn-primary">Small</Button>
      <Button size="default" className="ff-btn-primary">Default</Button>
      <Button size="lg" className="ff-btn-primary">Large</Button>
      <Button size="icon" className="ff-btn-primary">
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'All available button sizes.',
      },
    },
  },
};