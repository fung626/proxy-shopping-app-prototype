import { useLanguage } from '@/store/LanguageContext';
import { RefreshCw } from 'lucide-react';
import React, {
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  refreshing?: boolean;
  disabled?: boolean;
  pullThreshold?: number;
  maxPullDistance?: number;
  refreshText?: string;
  releaseText?: string;
  pullingText?: string;
  className?: string;
}

export function PullToRefresh({
  children,
  onRefresh,
  refreshing = false,
  disabled = false,
  pullThreshold = 50,
  maxPullDistance = 80,
  refreshText = 'common.pullToRefresh',
  releaseText = 'common.releaseToRefresh',
  pullingText = 'common.refreshing',
  className = '',
}: PullToRefreshProps) {
  const { t } = useLanguage();
  // Pull to refresh state
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const isScrollAtTopRef = useRef(true);

  // Pull to refresh handlers
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled || refreshing) return;
      if (
        containerRef.current &&
        containerRef.current.scrollTop === 0
      ) {
        startYRef.current = e.touches[0].clientY;
        isScrollAtTopRef.current = true;
      } else {
        isScrollAtTopRef.current = false;
      }
    },
    [disabled, refreshing]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isScrollAtTopRef.current || refreshing || disabled) return;

      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startYRef.current;

      if (
        deltaY > 0 &&
        containerRef.current &&
        containerRef.current.scrollTop === 0
      ) {
        e.preventDefault();
        setIsPulling(true);
        const distance = Math.min(deltaY * 0.5, maxPullDistance);
        setPullDistance(distance);
      }
    },
    [refreshing, disabled, maxPullDistance]
  );

  const handleTouchEnd = useCallback(async () => {
    if (isPulling && !disabled) {
      if (pullDistance > pullThreshold) {
        // Trigger refresh
        await onRefresh();
      }
      setIsPulling(false);
      setPullDistance(0);
    }
  }, [isPulling, pullDistance, pullThreshold, onRefresh, disabled]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      isScrollAtTopRef.current = target.scrollTop === 0;
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className={`overflow-y-auto ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onScroll={handleScroll}
      style={{
        transform: `translateY(${
          isPulling
            ? Math.min(pullDistance, maxPullDistance * 0.6)
            : 0
        }px)`,
        transition: isPulling ? 'none' : 'transform 0.3s ease-out',
        paddingTop: isPulling || refreshing ? '8px' : '0px',
      }}
    >
      {/* Pull to refresh indicator */}
      <div
        className={`flex justify-center ${
          isPulling || refreshing ? 'py-4' : 'py-0'
        } px-4 transition-all duration-300`}
        style={{
          opacity: isPulling || refreshing ? 1 : 0,
          height: isPulling || refreshing ? 'auto' : 0,
          overflow: 'hidden',
        }}
      >
        <div className="flex items-center justify-center space-x-2 text-muted-foreground bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
          />
          <span className="text-sm font-medium">
            {refreshing
              ? t(pullingText)
              : pullDistance > pullThreshold
              ? t(releaseText)
              : t(refreshText)}
          </span>
        </div>
      </div>
      {/* Content */}
      {children}
    </div>
  );
}
