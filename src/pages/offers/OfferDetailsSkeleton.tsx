import { Skeleton } from '@/components/ui/skeleton';

export function OfferDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Image Carousel Skeleton */}
      <div className="relative">
        {/* Header overlay skeleton */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 safe-area-inset-top">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex items-center space-x-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>
        {/* Image skeleton */}
        <div className="aspect-[4/3] bg-muted">
          <Skeleton className="w-full h-full" />
          {/* Image counter skeleton */}
          <div className="absolute bottom-4 right-4">
            <Skeleton className="w-16 h-6 rounded-full" />
          </div>
          {/* Navigation dots skeleton */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {[1, 2, 3, 4].map((_, index) => (
              <Skeleton
                key={index}
                className="w-2 h-2 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
      {/* Content Skeleton */}
      <div className="px-4 pb-40">
        {/* Title Section Skeleton */}
        <div className="py-6">
          <div className="flex items-start justify-between mb-2">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <Skeleton className="h-4 w-1/2 mb-4" />
          <div className="flex items-center space-x-4 mb-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          {/* Tags skeleton */}
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <Skeleton
                key={index}
                className="h-6 w-16 rounded-full"
              />
            ))}
          </div>
        </div>

        <div className="border-t border-border my-6" />
        {/* Agent Info Skeleton */}
        <div className="py-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="flex items-center space-x-4">
            <Skeleton className="w-16 h-16 rounded-full" />

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-3 w-40" />
            </div>
          </div>
        </div>
        <div className="border-t border-border my-6" />
        {/* Offer Features Skeleton */}
        <div className="py-6">
          <Skeleton className="h-6 w-32 mb-4" />

          <div className="space-y-4">
            {[1, 2, 3, 4].map((_, index) => (
              <div key={index} className="flex items-start space-x-4">
                <Skeleton className="w-8 h-8 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-border my-6" />
        {/* About This Offer Skeleton */}
        <div className="py-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-4">
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />

              {/* Highlight boxes skeleton */}
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-2 mb-1">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-3 w-32" />
                </div>

                <div className="p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-2 mb-1">
                    <Skeleton className="h-4 w-4 rounded" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
            </div>
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
        <div className="border-t border-border my-6" />
        {/* What's Included Skeleton */}
        <div className="py-6">
          <Skeleton className="h-6 w-32 mb-4" />

          <div className="space-y-4">
            {/* Service Inclusions */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-40" />
              <div className="grid grid-cols-1 gap-3">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30"
                  >
                    <Skeleton className="h-4 w-4 rounded mt-0.5" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
            {/* Additional Benefits */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-36" />
              <div className="grid grid-cols-1 gap-3">
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30"
                  >
                    <Skeleton className="h-4 w-4 rounded mt-0.5" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-1" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Price Breakdown */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <div className="p-4 rounded-lg bg-muted/50 border">
                <div className="space-y-2">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                  <div className="border-t border-border my-2" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-3 w-full mt-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-border my-6" />
        {/* Agent Stats Skeleton */}
        <div className="py-6">
          <Skeleton className="h-6 w-40 mb-4" />

          <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/30">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="text-center">
                <Skeleton className="h-6 w-12 mx-auto mb-1" />
                <Skeleton className="h-3 w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Sticky Bottom Section Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-area-inset-bottom">
        <div className="p-4">
          <div className="mb-4">
            <div className="flex items-baseline space-x-1 mb-1">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-10" />
            </div>
            <Skeleton className="h-3 w-48" />
          </div>

          <div className="flex space-x-3">
            <Skeleton className="flex-1 h-12 rounded-lg" />
            <Skeleton className="flex-1 h-12 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
