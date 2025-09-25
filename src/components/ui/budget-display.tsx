import React from 'react';
import { DollarSign, TrendingUp, Target, CreditCard } from 'lucide-react';
import { cn } from './utils';

interface BudgetDisplayProps {
  budget: string | { min: number; max: number; currency: string };
  variant?: 'default' | 'card' | 'minimal' | 'prominent' | 'gradient';
  className?: string;
}

export function BudgetDisplay({ 
  budget, 
  variant = 'default',
  className 
}: BudgetDisplayProps) {
  // Convert budget object to string format
  const budgetString = typeof budget === 'string' 
    ? budget 
    : `${budget.currency === 'USD' ? '$' : budget.currency === 'EUR' ? '€' : '¥'}${budget.min} - ${budget.currency === 'USD' ? '$' : budget.currency === 'EUR' ? '€' : '¥'}${budget.max}`;
  
  switch (variant) {
    case 'card':
      return (
        <div className={cn("bg-card border rounded-lg p-4", className)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Budget Range</p>
                <p className="text-xl font-bold text-foreground">{budgetString}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Est. Total</p>
              <p className="text-sm font-medium text-green-600">Inclusive</p>
            </div>
          </div>
        </div>
      );

    case 'minimal':
      return (
        <div className={cn("flex items-center space-x-2", className)}>
          <DollarSign className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">{budgetString}</span>
        </div>
      );

    case 'prominent':
      return (
        <div className={cn("bg-primary/5 border-2 border-primary/20 rounded-xl p-4", className)}>
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-3 rounded-full">
              <Target className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Shopping Budget</p>
              <p className="text-2xl font-bold text-primary">{budgetString}</p>
              <p className="text-xs text-muted-foreground">Including fees & shipping</p>
            </div>
          </div>
        </div>
      );

    case 'gradient':
      return (
        <div className={cn("bg-gradient-to-r from-primary/10 to-accent/20 border border-primary/30 rounded-lg p-4", className)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/20 p-2.5 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Budget Allocation</p>
                <p className="text-xl font-bold text-primary">{budgetString}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center space-x-1 bg-primary/10 px-2 py-1 rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-xs font-medium text-primary">Active</span>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className={cn("p-3 bg-primary/10 rounded-lg border border-primary/20", className)}>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Budget</p>
              <p className="text-lg font-semibold text-primary">{budgetString}</p>
            </div>
          </div>
        </div>
      );
  }
}