import React from "react";
import { cn } from "./utils";

interface ProgressStepsProps {
  currentStep: number;
  numberOfSteps: number;
  className?: string;
  stepTitles?: string[];
  showTitles?: boolean;
}

export function ProgressSteps({
  currentStep,
  numberOfSteps,
  className,
  stepTitles,
  showTitles = false,
}: ProgressStepsProps) {
  const activeColor = (index: number) =>
    currentStep >= index ? "bg-primary" : "bg-gray-300";
  const isFinalStep = (index: number) =>
    index === numberOfSteps - 1;

  if (showTitles && stepTitles) {
    return (
      <div className={cn("space-y-4", className)}>
        {stepTitles.map((title, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div
              className={cn(
                "w-[6px] h-[6px] rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                currentStep > index + 1
                  ? "bg-primary text-primary-foreground"
                  : currentStep === index + 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "text-sm transition-colors",
                currentStep >= index + 1 ? "text-foreground font-medium" : "text-muted-foreground"
              )}
            >
              {title}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center px-2 py-4",
        className,
      )}
    >
      {Array.from({ length: numberOfSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div
            className={cn(
              "w-[6px] h-[6px] rounded-full transition-colors",
              activeColor(index),
            )}
          />
          {!isFinalStep(index) && (
            <div
              className={cn(
                "mx-2 h-[2px] flex-grow transition-colors",
                activeColor(index + 1),
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}