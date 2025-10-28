import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import { ArrowRight, Code, Rocket, Star } from 'lucide-react';

const meta: Meta<typeof Card> = {
  title: 'FlashFusion/UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Flexible card component for displaying content in FlashFusion. Features interactive hover effects and multiple composition patterns.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Default Card</CardTitle>
        <CardDescription>This is a basic card example</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This is a simple example of how cards work in FlashFusion.</p>
      </CardContent>
    </Card>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card className="w-80 ff-card-interactive">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover to see animation effects</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has hover effects and appears interactive.</p>
      </CardContent>
      <CardFooter>
        <Button className="ff-btn-primary">
          Learn More
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const ProjectCard: Story = {
  render: () => (
    <Card className="w-80 ff-card-interactive">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              E-Commerce App
            </CardTitle>
            <CardDescription>React + TypeScript + Tailwind</CardDescription>
          </div>
          <Badge variant="secondary">Active</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            A modern e-commerce platform with AI-powered recommendations and real-time inventory management.
          </p>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-muted-foreground">75%</span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3" /> 12 likes
            </span>
            <span>Last updated 2 hours ago</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm">Edit</Button>
        <Button className="ff-btn-primary" size="sm">
          <Rocket className="w-4 h-4 mr-2" />
          Deploy
        </Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of a project card with progress tracking and action buttons.',
      },
    },
  },
};

export const StatsCard: Story = {
  render: () => (
    <Card className="w-64">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
        <Code className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold ff-text-gradient">42</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-green-500">+12%</span> from last month
        </p>
      </CardContent>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Statistics card perfect for dashboards and analytics.',
      },
    },
  },
};

export const GlowEffect: Story = {
  render: () => (
    <Card className="w-80 ff-card-interactive ff-hover-glow">
      <CardHeader>
        <CardTitle>Premium Feature</CardTitle>
        <CardDescription>Unlock advanced capabilities</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has a special glow effect on hover, perfect for highlighting premium features.</p>
      </CardContent>
      <CardFooter>
        <Button className="ff-btn-accent w-full">Upgrade Now</Button>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Card with premium glow effect for highlighting special content.',
      },
    },
  },
};

export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} className="ff-card-interactive">
          <CardHeader>
            <CardTitle>Project {i}</CardTitle>
            <CardDescription>Sample project description</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={Math.random() * 100} className="h-2" />
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">View</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Example of cards arranged in a responsive grid layout.',
      },
    },
  },
};