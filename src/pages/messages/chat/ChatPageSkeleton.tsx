import { Skeleton } from '@/components/ui/skeleton';

export function ChatPageSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 safe-area-inset-top">
        <div className="flex items-center space-x-3">
          {/* Back button */}
          <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />

          <div className="flex items-center space-x-3 flex-1 min-w-0">
            {/* Avatar */}
            <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />

            <div className="flex-1 min-w-0 space-y-1">
              {/* Name */}
              <Skeleton className="h-4 w-32" />
              {/* Status */}
              <Skeleton className="h-3 w-20" />
            </div>
          </div>

          {/* More button */}
          <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
        </div>

        {/* Request title badge */}
        <div className="mt-2">
          <Skeleton className="h-6 w-40 rounded-full" />
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-hidden p-4 space-y-4">
        {/* Agent message */}
        <div className="flex items-start space-x-2">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-20 w-3/4 rounded-2xl" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* User message */}
        <div className="flex items-start space-x-2 justify-end">
          <div className="space-y-2 flex-1 flex flex-col items-end">
            <Skeleton className="h-16 w-2/3 rounded-2xl" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* Agent message */}
        <div className="flex items-start space-x-2">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-24 w-4/5 rounded-2xl" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>

        {/* User message */}
        <div className="flex items-start space-x-2 justify-end">
          <div className="space-y-2 flex-1 flex flex-col items-end">
            <Skeleton className="h-12 w-1/2 rounded-2xl" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="bg-card border-t border-border p-4 safe-area-inset-bottom">
        <div className="flex items-center space-x-2">
          {/* Attachment button */}
          <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />

          {/* Input */}
          <Skeleton className="h-10 flex-1 rounded-lg" />

          {/* Send button */}
          <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}
