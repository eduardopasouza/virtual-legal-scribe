
import React from "react";
import { cn } from "@/lib/utils";

interface StepsProps {
  currentStep: number;
  className?: string;
  children: React.ReactNode;
}

export function Steps({ currentStep, className, children }: StepsProps) {
  // Count all Step children
  const childrenArray = React.Children.toArray(children);
  const totalSteps = childrenArray.length;

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<StepProps>, {
              stepNumber: index + 1,
              isActive: index + 1 === currentStep,
              isCompleted: index + 1 < currentStep,
              isLast: index === totalSteps - 1,
            });
          }
          return child;
        })}
      </div>
    </div>
  );
}

interface StepProps {
  title: string;
  description?: string;
  stepNumber?: number;
  isActive?: boolean;
  isCompleted?: boolean;
  isLast?: boolean;
}

export function Step({
  title,
  description,
  stepNumber,
  isActive,
  isCompleted,
  isLast,
}: StepProps) {
  return (
    <div className="flex flex-1 items-center">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold",
            isActive && "border-primary bg-primary text-primary-foreground",
            isCompleted && "border-primary bg-primary text-primary-foreground",
            !isActive && !isCompleted && "border-muted-foreground/40 text-muted-foreground"
          )}
        >
          {isCompleted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            stepNumber
          )}
        </div>
        <div className="text-center mt-2 px-2">
          <div
            className={cn(
              "text-xs font-medium",
              (isActive || isCompleted) ? "text-primary" : "text-muted-foreground"
            )}
          >
            {title}
          </div>
          {description && (
            <div className="mt-1 text-xs text-muted-foreground">{description}</div>
          )}
        </div>
      </div>
      {!isLast && (
        <div className="w-full flex-1 mx-2">
          <div
            className={cn(
              "h-0.5",
              isCompleted ? "bg-primary" : "bg-muted-foreground/20"
            )}
          />
        </div>
      )}
    </div>
  );
}
