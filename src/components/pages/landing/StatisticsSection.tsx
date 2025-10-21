import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../../ui/card';
import { TrendingUp, Zap, Users, Rocket } from 'lucide-react';

export function StatisticsSection() {
  const stats = [
    {
      icon: TrendingUp,
      value: "700%",
      label: "AI adoption growth in development",
      description: "Year-over-year increase in AI tool usage",
      color: "text-primary"
    },
    {
      icon: Zap,
      value: "80%",
      label: "Faster development cycles",
      description: "Average time reduction with AI assistance",
      color: "text-secondary"
    },
    {
      icon: Users,
      value: "15M+",
      label: "Developers using AI tools",
      description: "Global developer community adoption",
      color: "text-accent"
    },
    {
      icon: Rocket,
      value: "95%",
      label: "Enterprise AI integration",
      description: "Fortune 500 companies adopting AI",
      color: "text-primary"
    }
  ];

  const trends = [
    {
      trend: "AI-First Development",
      growth: "+850%",
      description: "Teams adopting AI-first development workflows"
    },
    {
      trend: "Code Generation",
      growth: "+600%",
      description: "Usage of AI-powered code generation tools"
    },
    {
      trend: "Automated Testing",
      growth: "+450%",
      description: "AI-driven testing and quality assurance"
    },
    {
      trend: "Deployment Automation",
      growth: "+380%",
      description: "AI-optimized deployment pipelines"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card/50">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6 ff-text-gradient">
            The AI Revolution is Here
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Artificial Intelligence is transforming software development at an unprecedented pace. 
            FlashFusion puts you at the forefront of this revolution.
          </p>
        </motion.div>

        {/* Main Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="ff-card-interactive text-center h-full">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl font-bold mb-2 ${stat.color}`}>
                    {stat.value}
                  </div>
                  <h3 className="font-semibold mb-2">{stat.label}</h3>
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* AI Trends */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card/50 rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">AI Development Trends (2024)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trends.map((trend, index) => (
              <motion.div
                key={trend.trend}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-background/50"
              >
                <div>
                  <h4 className="font-semibold">{trend.trend}</h4>
                  <p className="text-sm text-muted-foreground">{trend.description}</p>
                </div>
                <div className="text-2xl font-bold text-secondary">{trend.growth}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}