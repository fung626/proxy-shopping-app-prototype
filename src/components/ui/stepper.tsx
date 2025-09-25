import React from 'react';

interface StepperProps {
  currentStep: number;
  numberOfSteps: number;
  className?: string;
  stepTitles?: string[];
}

export default function Stepper({ currentStep, numberOfSteps, className = '', stepTitles }: StepperProps) {
  const activeColor = (index: number) => currentStep >= index + 1 ? 'bg-primary' : 'bg-muted';
  const lineColor = (index: number) => currentStep > index + 1 ? 'bg-primary' : 'bg-muted';
  const isFinalStep = (index: number) => index === numberOfSteps - 1;

  const getTitleColor = (index: number) => {
    if (currentStep > index) return 'text-primary font-medium';
    if (currentStep === index + 1) return 'text-foreground font-medium';
    return 'text-muted-foreground';
  };

  return (
    <div className={`flex items-start ${className}`}>
      {Array.from({ length: numberOfSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div className="flex flex-col items-center flex-1">
            <div className={`w-[6px] h-[6px] rounded-full transition-colors ${activeColor(index)}`}></div>
            {stepTitles && false && (
              <span 
                className={`text-xs text-center mt-2 ${getTitleColor(index)}`}
              >
                {stepTitles[index]}
              </span>
            )}
          </div>
          {!isFinalStep(index) && (
            <div className={`h-[2px] flex-grow mt-[1px] ${lineColor(index)} transition-colors`}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}