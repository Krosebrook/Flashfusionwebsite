import { Card } from '../../ui/card';

interface TermsSectionProps {
  title: string;
  content: Array<{
    subtitle?: string;
    text: string;
  }>;
  icon?: React.ComponentType<{ className?: string }>;
}

export function TermsSection({ title, content, icon: Icon }: TermsSectionProps) {
  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        {Icon && <Icon className="w-6 h-6 text-primary" />}
        {title}
      </h2>
      <div className="space-y-6">
        {content.map((item, index) => (
          <div key={index}>
            {item.subtitle && (
              <h3 className="text-lg font-semibold mb-2">{item.subtitle}</h3>
            )}
            <p className="text-muted-foreground leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}