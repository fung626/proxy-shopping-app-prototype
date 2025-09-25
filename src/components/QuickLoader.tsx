import React from 'react';

export const QuickLoader = React.memo(function QuickLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
});