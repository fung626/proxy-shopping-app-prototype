import { Skeleton } from '@/components/ui/skeleton';

export function OrderDetailsSkeleton() {
  return (
    <div className="flex-1 bg-background pb-20">
      {/* Header */}
      <div className="bg-background p-4 sticky top-0 z-10 border-b">
        <div className="flex items-center justify-between text-sm">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-8" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Order items */}
        <div className="p-4 rounded-xl bg-muted/50">
          <h2 className="font-semibold mb-4">
            <Skeleton className="h-6 w-32" />
          </h2>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-3">
                <Skeleton className="w-16 h-16 flex-shrink-0 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-3 w-3/4 mb-2" />
                  <div className="flex items-center justify-between mt-1">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Skeleton className="h-4 w-1/3 mb-2" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>

        {/* Status / Progress */}
        <div className="p-4 rounded-xl bg-muted/50">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-3 w-full mb-3" />
          <Skeleton className="h-2 w-full rounded-full" />
        </div>

        {/* Delivery Info */}
        <div className="p-4 rounded-xl bg-muted/50">
          <h2 className="font-semibold mb-4">
            <Skeleton className="h-6 w-32" />
          </h2>
          <div className="space-y-2 text-sm">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </div>

        {/* Payment Info */}
        <div className="p-4 rounded-xl bg-muted/50">
          <h2 className="font-semibold mb-4">
            <Skeleton className="h-6 w-40" />
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/6" />
            </div>
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>

        {/* Partner Info */}
        <div className="p-4 rounded-xl bg-muted/50">
          <h2 className="font-semibold mb-4">
            <Skeleton className="h-6 w-40" />
          </h2>
          <div className="flex items-center space-x-3">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
        </div>

        {/* History */}
        <div className="p-4 rounded-xl bg-muted/50">
          <h2 className="font-semibold mb-4">
            <Skeleton className="h-6 w-40" />
          </h2>
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex space-x-3">
                <div className="flex flex-col items-center">
                  <Skeleton className="w-2 h-2 rounded-full bg-primary" />
                  <div className="w-px h-8 bg-border mt-1" />
                </div>
                <div className="flex-1 pb-3">
                  <Skeleton className="h-4 w-1/3 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dates / Actions */}
        <div className="p-4 rounded-xl bg-muted/50">
          <div className="space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="mt-4 flex space-x-2">
            <Skeleton className="h-10 flex-1 rounded-md" />
            <Skeleton className="h-10 flex-1 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
