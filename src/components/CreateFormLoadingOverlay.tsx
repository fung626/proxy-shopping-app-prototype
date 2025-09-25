import React from 'react';

interface CreateFormLoadingOverlayProps {
  type: 'request' | 'offer';
  isVisible: boolean;
}

export function CreateFormLoadingOverlay({ type, isVisible }: CreateFormLoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      {/* Header */}
      <div className="safe-area-inset-top bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="w-8" /> {/* Spacer */}
          <h1 className="font-semibold">
            {type === 'request' ? 'Creating Request' : 'Creating Offer'}
          </h1>
          <div className="w-8" /> {/* Spacer */}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <h2 className="text-lg font-semibold mb-2">
            {type === 'request' ? 'Creating Your Request' : 'Creating Your Offer'}
          </h2>
          <p className="text-muted-foreground text-sm">
            {type === 'request' 
              ? 'Please wait while we post your proxy shopping request...'
              : 'Please wait while we publish your shopping offer...'
            }
          </p>
        </div>
      </div>
    </div>
  );
}