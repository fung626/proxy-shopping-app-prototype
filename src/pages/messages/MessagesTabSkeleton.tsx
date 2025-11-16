import { Skeleton } from '@/components/ui/skeleton';

export function MessagesTabSkeleton() {
  return (
    <div className="flex-1 bg-background pb-[74px]">
      {/* Header */}
      <div className="bg-card px-4 pt-12 pb-6">
        <Skeleton className="h-8 w-32 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="px-4 py-4">
        {/* Search Bar */}
        <div className="mb-6">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-3">
                {/* Avatar with online indicator */}
                <div className="relative flex-shrink-0">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  {index % 2 === 0 && (
                    <Skeleton className="absolute bottom-0 right-0 w-3 h-3 rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Skeleton className="h-5 w-32" />
                      {/* Pinned badge for some items */}
                      {index === 0 && (
                        <Skeleton className="h-4 w-8" />
                      )}
                    </div>
                    <Skeleton className="h-3 w-12" />
                  </div>

                  <Skeleton className="h-4 w-24 mb-1" />

                  <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-4 w-full" />
                    {/* Unread badge for some items */}
                    {index % 3 === 0 && (
                      <Skeleton className="h-5 w-6 rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
