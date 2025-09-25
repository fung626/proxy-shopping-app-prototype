import { ReactNode } from 'react';

interface PerformanceMonitorProps {
  componentName: string;
  warnThreshold?: number;
  children: ReactNode;
}

export function PerformanceMonitor({ children }: PerformanceMonitorProps) {
  // Simplified - just render children directly for now
  // This eliminates potential performance monitoring issues
  return <>{children}</>;
}