import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { ConfigWizard } from '../wizard/ConfigWizard';
import { ErrorBoundary } from '../ErrorBoundary';
import { X } from 'lucide-react';

interface AppWizardModalProps {
  showWizard: boolean;
  setShowWizard: (show: boolean) => void;
  onComplete: () => void;
}

export function AppWizardModal({ showWizard, setShowWizard, onComplete }: AppWizardModalProps) {
  if (!showWizard) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-background/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-auto"
      >
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowWizard(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ErrorBoundary>
          <ConfigWizard onComplete={onComplete} />
        </ErrorBoundary>
      </motion.div>
    </motion.div>
  );
}