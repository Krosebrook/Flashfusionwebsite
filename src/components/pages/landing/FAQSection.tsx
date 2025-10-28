import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent } from '../../ui/card';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export function FAQSection() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const faqs = [
    {
      question: "What makes FlashFusion different from other AI development platforms?",
      answer: "FlashFusion combines 60+ AI tools, gamification, and instant deployment in one platform. Unlike other tools that focus on single aspects, we provide a complete end-to-end development experience with XP progression, achievements, and deployment to 8+ platforms. Our AI-powered code reviews and community challenges create a unique learning environment."
    },
    {
      question: "How does the gamification system work?",
      answer: "You earn XP for completing tasks like using AI tools, deploying projects, and completing daily challenges. As you level up, you unlock new features, tools, and achievements. This makes learning and development fun while tracking your progress. Daily tasks keep you engaged and help build consistent coding habits."
    },
    {
      question: "Can I use FlashFusion without coding experience?",
      answer: "Absolutely! FlashFusion is designed for all skill levels. Our AI tools can generate code, create UIs, and handle complex logic with simple prompts. The gamification system guides beginners through the learning process, while experienced developers can leverage advanced features for rapid prototyping."
    },
    {
      question: "Which deployment platforms are supported?",
      answer: "We support 8+ major platforms including Vercel, Netlify, AWS, Google Cloud, Heroku, DigitalOcean, Railway, and Render. Each deployment is optimized for the target platform with automatic configuration, environment setup, and continuous deployment pipelines."
    },
    {
      question: "What types of applications can I build?",
      answer: "FlashFusion supports web applications, APIs, mobile-responsive sites, SaaS platforms, e-commerce stores, portfolios, landing pages, and more. Our AI tools cover frontend frameworks (React, Vue, Angular), backend services (Node.js, Python, Go), and databases (PostgreSQL, MongoDB, Firebase)."
    },
    {
      question: "Is there a free plan available?",
      answer: "Yes! Our Starter plan is completely free and includes access to 5 AI tools, 2 projects, community support, and basic deployment. It's perfect for learning and small projects. You can upgrade anytime as your needs grow."
    },
    {
      question: "How does the AI code review feature work?",
      answer: "Our AI analyzes your code for best practices, security vulnerabilities, performance optimizations, and maintainability. It provides detailed feedback with specific suggestions for improvement. This feature is available in Pro and Enterprise plans and learns from your coding patterns to provide personalized recommendations."
    },
    {
      question: "Can I collaborate with my team?",
      answer: "Yes! Pro plans include collaboration for up to 5 team members, while Enterprise plans support unlimited team members. Features include shared projects, real-time collaboration, role-based permissions, team analytics, and shared AI tool usage."
    },
    {
      question: "What kind of support do you provide?",
      answer: "Starter users get community support through our Discord server. Pro users receive priority email support with response times under 24 hours. Enterprise customers get 24/7 premium support, dedicated account managers, and optional training sessions."
    },
    {
      question: "How secure is my code and data?",
      answer: "Security is our top priority. All data is encrypted in transit and at rest. We use enterprise-grade security measures, regular security audits, and comply with SOC 2 and GDPR standards. Code is processed securely and never stored permanently on our servers."
    },
    {
      question: "Can I export my projects?",
      answer: "Absolutely! You own your code and can export it anytime. Projects are generated as standard code that works independently of our platform. We provide export tools for easy migration and deployment to your own infrastructure."
    },
    {
      question: "Do you offer custom enterprise solutions?",
      answer: "Yes! Enterprise plans include custom integrations, white-label options, on-premises deployment, custom AI model training, and dedicated infrastructure. Contact our sales team to discuss your specific requirements and pricing."
    }
  ];

  const categories = [
    {
      name: "Getting Started",
      faqs: faqs.slice(0, 3)
    },
    {
      name: "Platform Features",
      faqs: faqs.slice(3, 7)
    },
    {
      name: "Plans & Pricing",
      faqs: faqs.slice(7, 9)
    },
    {
      name: "Security & Enterprise",
      faqs: faqs.slice(9, 12)
    }
  ];

  return (
    <section className="py-20 bg-card/30">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to know about FlashFusion
          </p>
        </motion.div>

        <div className="space-y-8">
          {categories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-primary">{category.name}</h3>
              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const globalIndex = categoryIndex * 3 + faqIndex;
                  const isOpen = openFAQ === globalIndex;
                  
                  return (
                    <Card key={globalIndex} className="ff-card-interactive">
                      <CardContent className="p-0">
                        <button
                          onClick={() => setOpenFAQ(isOpen ? null : globalIndex)}
                          className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                        >
                          <h4 className="font-semibold pr-4">{faq.question}</h4>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                          )}
                        </button>
                        
                        <motion.div
                          initial={false}
                          animate={{
                            height: isOpen ? "auto" : 0,
                            opacity: isOpen ? 1 : 0
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Still have questions CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 p-8 bg-primary/5 rounded-lg"
        >
          <h4 className="text-xl font-semibold mb-4">Still have questions?</h4>
          <p className="text-muted-foreground mb-6">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="ff-btn-primary px-6 py-2 rounded-lg">Contact Support</button>
            <button className="ff-btn-secondary px-6 py-2 rounded-lg">Join Community</button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}