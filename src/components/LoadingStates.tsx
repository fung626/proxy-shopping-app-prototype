import React from 'react';
import { Loader2, Package, MessageCircle, User, Search, Heart } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  text
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      {text && (
        <span className="text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  );
};

// Context-aware loading states for different sections
interface ContextualLoadingProps {
  type: 'offers' | 'requests' | 'messages' | 'profile' | 'search' | 'general';
  className?: string;
}

export const ContextualLoading: React.FC<ContextualLoadingProps> = ({
  type,
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'offers':
        return <Package className="h-6 w-6 text-primary" />;
      case 'requests':
        return <Search className="h-6 w-6 text-primary" />;
      case 'messages':
        return <MessageCircle className="h-6 w-6 text-primary" />;
      case 'profile':
        return <User className="h-6 w-6 text-primary" />;
      case 'search':
        return <Search className="h-6 w-6 text-primary" />;
      default:
        return <Loader2 className="h-6 w-6 text-primary animate-spin" />;
    }
  };

  const getText = () => {
    switch (type) {
      case 'offers':
        return 'Loading offers...';
      case 'requests':
        return 'Loading requests...';
      case 'messages':
        return 'Loading messages...';
      case 'profile':
        return 'Loading profile...';
      case 'search':
        return 'Searching...';
      default:
        return 'Loading...';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <div className="animate-pulse">
        {getIcon()}
      </div>
      <span className="text-sm text-muted-foreground mt-2">{getText()}</span>
    </div>
  );
};

// Skeleton components for different content types
export const OfferCardSkeleton: React.FC = () => (
  <div className="bg-card rounded-lg border p-4 space-y-3">
    <div className="flex items-start gap-3">
      <Skeleton className="h-12 w-12 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-6 rounded" />
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-2/3" />
    <div className="flex items-center justify-between">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>
  </div>
);

export const RequestCardSkeleton: React.FC = () => (
  <div className="bg-card rounded-lg border p-4 space-y-3">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    <Skeleton className="h-3 w-full" />
    <Skeleton className="h-3 w-4/5" />
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-24" />
      <div className="flex gap-2">
        <Skeleton className="h-7 w-20 rounded-md" />
        <Skeleton className="h-7 w-20 rounded-md" />
      </div>
    </div>
  </div>
);

export const MessageSkeleton: React.FC = () => (
  <div className="flex items-center gap-3 p-4 border-b">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="flex-1 space-y-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-12" />
      </div>
      <Skeleton className="h-3 w-3/4" />
    </div>
    <Skeleton className="h-2 w-2 rounded-full" />
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center gap-4 p-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    
    {/* Stats */}
    <div className="grid grid-cols-3 gap-4 px-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="text-center space-y-1">
          <Skeleton className="h-6 w-8 mx-auto" />
          <Skeleton className="h-3 w-16 mx-auto" />
        </div>
      ))}
    </div>
    
    {/* Menu items */}
    <div className="space-y-2 px-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-5" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-4 w-4" />
        </div>
      ))}
    </div>
  </div>
);

// Grid skeletons for list views
interface GridSkeletonProps {
  type: 'offers' | 'requests' | 'messages';
  count?: number;
  className?: string;
}

export const GridSkeleton: React.FC<GridSkeletonProps> = ({
  type,
  count = 6,
  className = ''
}) => {
  const SkeletonComponent = {
    offers: OfferCardSkeleton,
    requests: RequestCardSkeleton,
    messages: MessageSkeleton
  }[type];

  return (
    <div className={className}>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonComponent key={i} />
      ))}
    </div>
  );
};

// Full page loading overlay
interface PageLoadingProps {
  title?: string;
  description?: string;
  type?: 'offers' | 'requests' | 'messages' | 'profile' | 'search' | 'general';
}

export const PageLoading: React.FC<PageLoadingProps> = ({
  title,
  description,
  type = 'general'
}) => (
  <div className="min-h-screen bg-background flex items-center justify-center p-4">
    <div className="text-center max-w-sm">
      <ContextualLoading type={type} className="mb-4" />
      {title && (
        <h2 className="text-lg font-medium text-foreground mb-2">{title}</h2>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  </div>
);

// Inline loading for buttons and smaller components
interface InlineLoadingProps {
  text?: string;
  size?: 'sm' | 'md';
  className?: string;
}

export const InlineLoading: React.FC<InlineLoadingProps> = ({
  text,
  size = 'sm',
  className = ''
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <Loader2 className={`animate-spin ${size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'}`} />
    {text && (
      <span className={`${size === 'sm' ? 'text-xs' : 'text-sm'}`}>{text}</span>
    )}
  </div>
);