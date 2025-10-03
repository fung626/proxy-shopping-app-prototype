import { AlertTriangle, Home, RefreshCw, Wifi } from 'lucide-react';
import React from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';

interface ErrorState {
  type: 'network' | 'server' | 'auth' | 'data' | 'unknown';
  message: string;
  details?: string;
  action?: string;
}

interface ErrorHandlerProps {
  error: ErrorState;
  onRetry?: () => void;
  onGoHome?: () => void;
  className?: string;
}

export const ErrorHandler: React.FC<ErrorHandlerProps> = ({
  error,
  onRetry,
  onGoHome,
  className = '',
}) => {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'network':
        return <Wifi className="h-6 w-6 text-orange-500" />;
      case 'server':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      case 'auth':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getErrorColor = () => {
    switch (error.type) {
      case 'network':
        return 'border-orange-200 bg-orange-50';
      case 'server':
        return 'border-red-200 bg-red-50';
      case 'auth':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <Alert className={`${getErrorColor()} ${className}`}>
      <div className="flex items-start gap-3">
        {getErrorIcon()}
        <div className="flex-1 min-w-0">
          <AlertDescription className="text-sm">
            <div className="font-medium text-gray-900 mb-1">
              {error.message}
            </div>
            {error.details && (
              <div className="text-gray-600 text-xs">
                {error.details}
              </div>
            )}
            {error.action && (
              <div className="text-gray-500 text-xs mt-1">
                {error.action}
              </div>
            )}
          </AlertDescription>
          {(onRetry || onGoHome) && (
            <div className="flex gap-2 mt-3">
              {onRetry && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onRetry}
                  className="text-xs h-8"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Try Again
                </Button>
              )}
              {onGoHome && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onGoHome}
                  className="text-xs h-8"
                >
                  <Home className="h-3 w-3 mr-1" />
                  Go Home
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Alert>
  );
};

// Hook for creating standardized error states
export const useErrorHandler = () => {
  const createError = (
    type: ErrorState['type'],
    message: string,
    details?: string,
    action?: string
  ): ErrorState => ({
    type,
    message,
    details,
    action,
  });

  const networkError = (details?: string) =>
    createError(
      'network',
      'Connection Problem',
      details ||
        'Please check your internet connection and try again.',
      'Make sure you have a stable internet connection.'
    );

  const serverError = (details?: string) =>
    createError(
      'server',
      'Server Error',
      details ||
        'Our servers are experiencing issues. Please try again.',
      'If the problem persists, please contact support.'
    );

  const authError = (details?: string) =>
    createError(
      'auth',
      'Authentication Required',
      details || 'Please sign in to continue.',
      'Your session may have expired.'
    );

  const dataError = (details?: string) =>
    createError(
      'data',
      'Data Error',
      details || 'Unable to load requested data.',
      'Please try refreshing the page.'
    );

  return {
    createError,
    networkError,
    serverError,
    authError,
    dataError,
  };
};

//  error boundary for better error reporting
interface ErrorBoundaryState {
  hasError: boolean;
  error: ErrorState | null;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{
    onReset?: () => void;
    onGoHome?: () => void;
  }>,
  ErrorBoundaryState
> {
  constructor(
    props: React.PropsWithChildren<{
      onReset?: () => void;
      onGoHome?: () => void;
    }>
  ) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error('ErrorBoundary caught error:', error);

    let errorState: ErrorState;

    if (
      error.message.includes('Network') ||
      error.message.includes('fetch')
    ) {
      errorState = {
        type: 'network',
        message: 'Connection Problem',
        details:
          'Unable to connect to our servers. Please check your internet connection.',
        action: 'Try again when your connection is stable.',
      };
    } else if (
      error.message.includes('ChunkLoadError') ||
      error.message.includes('Loading')
    ) {
      errorState = {
        type: 'data',
        message: 'Loading Error',
        details: 'Failed to load application resources.',
        action: 'Please refresh the page to try again.',
      };
    } else {
      errorState = {
        type: 'unknown',
        message: 'Unexpected Error',
        details: error.message,
        action: 'Please try reloading the application.',
      };
    }

    return {
      hasError: true,
      error: errorState,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary details:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <ErrorHandler
              error={this.state.error}
              onRetry={() => {
                this.setState({ hasError: false, error: null });
                this.props.onReset?.();
              }}
              onGoHome={this.props.onGoHome}
            />
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
