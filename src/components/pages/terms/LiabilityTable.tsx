import { Card } from '../../ui/card';
import { Scale } from 'lucide-react';
import { LIABILITY_TABLE } from '../../../lib/legal-constants';

export function LiabilityTable() {
  return (
    <Card className="p-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        <Scale className="w-6 h-6 text-primary" />
        Liability Limitations
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">Damage Type</th>
              <th className="text-left py-3">Coverage</th>
              <th className="text-left py-3">Period</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {LIABILITY_TABLE.map((row, index) => (
              <tr key={index} className="border-b">
                <td className="py-3">{row.type}</td>
                <td className="py-3">{row.coverage}</td>
                <td className="py-3">{row.period}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}