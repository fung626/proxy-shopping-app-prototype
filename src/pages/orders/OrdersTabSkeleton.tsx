import { Skeleton } from '@/components/ui/skeleton';

export function OrdersTabSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="p-4 bg-muted/50 rounded-lg">
          <div className="flex space-x-4 mb-2">
            {/* Image */}
            <Skeleton className="w-16 h-16 rounded-lg flex-shrink-0" />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-24 ml-2" />
              </div>

              <Skeleton className="h-5 w-full mb-2" />

              <div className="flex items-center justify-between mb-3">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-3 w-16" />
            </div>

            <Skeleton className="h-3 w-full mb-3" />

            {/* Progress bar */}
            <Skeleton className="h-2 w-full rounded-full" />
          </div>

          {/* Partner Info */}
          <div className="mb-3">
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Skeleton className="h-9 flex-1 rounded-md" />
            <Skeleton className="h-9 flex-1 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
