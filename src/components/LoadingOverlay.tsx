import { useLoadingStore } from '@/store/zustand/loadingStore';
import React from 'react';

export const LoadingOverlay: React.FC = () => {
  const { isLoading, message } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center p-6 bg-background rounded-lg shadow-lg">
        <div className="w-8 h-8 border-2 border-red-200 border-t-red-600 rounded-full animate-spin mb-4"></div>
        {message && (
          <p className="text-base text-muted-foreground text-center max-w-xs">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};
