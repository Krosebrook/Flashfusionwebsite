import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { deploymentBenefits } from './constants';

export function BenefitsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Why Deploy with FlashFusion?</CardTitle>
        <CardDescription>
          Experience seamless deployment with enterprise-grade features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deploymentBenefits.map((benefit, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 text-xl">
                {benefit.icon}
              </div>
              <h4 className="font-semibold mb-2">{benefit.title}</h4>
              <p className="text-sm text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}