import React from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Badge } from '../../ui/badge';
import { Star, Quote } from 'lucide-react';

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Lead Developer",
      company: "TechFlow Inc.",
      avatar: "SC",
      quote: "FlashFusion reduced our development time by 70%. What used to take weeks now takes days. The AI tools are incredibly intuitive and the deployment process is seamless.",
      project: "E-commerce Platform",
      metric: "70% faster delivery",
      rating: 5
    },
    {
      name: "Marcus Rodriguez",
      role: "Startup Founder",
      company: "InnovateLab",
      avatar: "MR",
      quote: "As a non-technical founder, FlashFusion allowed me to build and deploy a functional MVP in just 3 days. The gamification aspect kept me motivated throughout the process.",
      project: "SaaS MVP",
      metric: "3 days to launch",
      rating: 5
    },
    {
      name: "Emily Watson",
      role: "Full-Stack Developer",
      company: "Digital Dynamics",
      avatar: "EW",
      quote: "The 60+ AI tools cover everything I need. From UI design to API generation, it's like having a whole development team at my fingertips. Game-changer!",
      project: "Client Dashboard",
      metric: "60% cost reduction",
      rating: 5
    },
    {
      name: "David Park",
      role: "CTO",
      company: "ScaleUp Solutions",
      avatar: "DP",
      quote: "We've deployed 50+ projects using FlashFusion. The consistency and quality are outstanding. Our team productivity has never been higher.",
      project: "Multi-tenant Platform",
      metric: "50+ deployments",
      rating: 5
    },
    {
      name: "Lisa Thompson",
      role: "Freelance Developer",
      company: "Independent",
      avatar: "LT",
      quote: "FlashFusion transformed my freelance business. I can now take on 3x more projects while delivering higher quality work. The XP system makes coding addictive!",
      project: "Portfolio Websites",
      metric: "3x more projects",
      rating: 5
    },
    {
      name: "Ahmed Hassan",
      role: "DevOps Engineer",
      company: "CloudTech Corp",
      avatar: "AH",
      quote: "The automated deployment to 8+ platforms saved us countless hours. The monitoring and analytics features give us insights we never had before.",
      project: "Microservices Architecture",
      metric: "80% deployment time saved",
      rating: 5
    }
  ];

  const successStories = [
    {
      company: "StartupXYZ",
      story: "Launched their MVP in 5 days",
      result: "Secured $2M Series A funding",
      industry: "FinTech"
    },
    {
      company: "EduTech Pro",
      story: "Built learning platform with AI",
      result: "10K+ active users in first month",
      industry: "Education"
    },
    {
      company: "HealthApp Inc",
      story: "Created telehealth solution",
      result: "Reduced development costs by 65%",
      industry: "Healthcare"
    }
  ];

  return (
    <section className="py-20 bg-card/30">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">
            Loved by Developers Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of developers who have transformed their workflow with FlashFusion
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="ff-card-interactive h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Avatar className="w-12 h-12 mr-3">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-secondary">{testimonial.company}</p>
                    </div>
                  </div>

                  <div className="flex items-center mb-3">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <Quote className="w-8 h-8 text-primary/20 mb-3" />
                  <p className="text-sm mb-4 italic">"{testimonial.quote}"</p>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Badge variant="secondary" className="text-xs">
                      {testimonial.project}
                    </Badge>
                    <span className="text-xs font-semibold text-primary">
                      {testimonial.metric}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Success Stories */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold text-center mb-8">Success Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((story, index) => (
              <motion.div
                key={story.company}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Badge variant="outline" className="mb-3">{story.industry}</Badge>
                <h4 className="font-bold text-lg mb-2">{story.company}</h4>
                <p className="text-muted-foreground mb-2">{story.story}</p>
                <p className="font-semibold text-primary">{story.result}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}