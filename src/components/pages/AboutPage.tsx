import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { 
  Zap, 
  Users, 
  Target, 
  Heart,
  Award,
  Globe,
  Rocket,
  Code
} from 'lucide-react';
import { motion } from 'motion/react';

export default function AboutPage() {
  const values = [
    {
      icon: Zap,
      title: "Innovation First",
      description: "We push the boundaries of what's possible with AI-powered development tools."
    },
    {
      icon: Users,
      title: "Creator Focused",
      description: "Everything we build is designed to empower creators and entrepreneurs."
    },
    {
      icon: Target,
      title: "Quality Driven",
      description: "We maintain the highest standards in everything we create and deliver."
    },
    {
      icon: Heart,
      title: "Community Centered",
      description: "Our community is at the heart of everything we do and build."
    }
  ];

  const stats = [
    { label: "AI Tools", value: "60+", icon: Code },
    { label: "Supported Platforms", value: "8+", icon: Globe },
    { label: "Active Users", value: "10K+", icon: Users },
    { label: "Projects Created", value: "50K+", icon: Rocket }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-2">
          <Zap className="w-8 h-8 text-primary" />
          <h1 className="ff-text-gradient">About FlashFusion</h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          We're building the future of AI-powered application development, empowering creators and entrepreneurs to bring their ideas to life faster than ever before.
        </p>
      </motion.div>

      {/* Mission Statement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="ff-card-interactive">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To democratize web application development by providing a comprehensive, AI-powered platform that enables anyone to build, deploy, and scale professional applications without traditional barriers to entry.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <Card key={stat.label} className="ff-card-interactive text-center">
            <CardContent className="p-6">
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Values */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-8"
      >
        <h2 className="text-3xl font-bold text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="ff-card-interactive h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <value.icon className="w-6 h-6 text-primary" />
                    <CardTitle>{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Story */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-8"
      >
        <h2 className="text-3xl font-bold text-center">Our Story</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-secondary" />
                <span>The Problem</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Building web applications has traditionally required extensive technical knowledge, 
                multiple tools, and significant time investment. Creators and entrepreneurs with 
                great ideas often faced insurmountable barriers to bringing their visions to life.
              </p>
            </CardContent>
          </Card>

          <Card className="ff-card-interactive">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Rocket className="w-5 h-5 text-accent" />
                <span>Our Solution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                FlashFusion eliminates these barriers with AI-powered tools that handle the 
                complexity while you focus on your vision. From ideation to deployment, 
                we provide everything you need in one integrated platform.
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Team */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center space-y-8"
      >
        <h2 className="text-3xl font-bold">Built by Creators, for Creators</h2>
        <Card className="ff-card-interactive">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <Award className="w-12 h-12 text-primary" />
              <div className="text-left">
                <h3 className="text-xl font-bold">Expert Team</h3>
                <p className="text-muted-foreground">AI researchers, developers, and creators</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              Our team combines decades of experience in AI, web development, and creator economy. 
              We understand the challenges because we've lived them, and we're passionate about 
              solving them for the next generation of digital creators.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center space-y-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-lg p-8"
      >
        <h2 className="text-2xl font-bold">Ready to Join Our Mission?</h2>
        <p className="text-muted-foreground">
          Be part of the revolution in AI-powered application development.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button className="ff-btn-primary">
            <Users className="w-4 h-4 mr-2" />
            Join Our Community
          </Button>
          <Button variant="outline">
            <Heart className="w-4 h-4 mr-2" />
            Follow Our Story
          </Button>
        </div>
      </motion.div>
    </div>
  );
}