import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center mb-10">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isCompleted = stepNum < currentStep;
        const isCurrent = stepNum === currentStep;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                  isCompleted && 'bg-gray-900 text-white',
                  isCurrent && 'bg-gray-900 text-white ring-4 ring-gray-200',
                  !isCompleted && !isCurrent && 'bg-gray-100 text-gray-400'
                )}
              >
                {isCompleted ? <Check size={16} /> : stepNum}
              </div>
              <span
                className={cn(
                  'text-xs mt-1.5 font-medium',
                  isCurrent ? 'text-gray-900' : 'text-gray-400'
                )}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  'h-0.5 w-20 mx-2 mb-5',
                  stepNum < currentStep ? 'bg-gray-900' : 'bg-gray-200'
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
