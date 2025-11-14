import { Skeleton } from '@/components/ui/skeleton';

export function MessagesTabSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card px-4 pt-12 pb-4 border-b border-border">
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-card border-b border-border">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Chat List Items */}
      <div className="flex-1 overflow-hidden">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="px-4 py-3 border-b border-border flex items-center space-x-3"
          >
            {/* Avatar */}
            <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />

            <div className="flex-1 min-w-0 space-y-2">
              {/* Name and timestamp row */}
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-12" />
              </div>

              {/* Request title */}
              <Skeleton className="h-3 w-24" />

              {/* Last message */}
              <Skeleton className="h-3 w-full" />
            </div>

            {/* Unread badge */}
            {index % 3 === 0 && (
              <Skeleton className="h-5 w-5 rounded-full flex-shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
