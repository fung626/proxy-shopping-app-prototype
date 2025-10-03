import React, { useEffect, useState } from 'react';

interface ErrorRecoveryProps {
  children: React.ReactNode;
}

export const ErrorRecovery: React.FC<ErrorRecoveryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Simplified error handling - only catch critical errors
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Only handle truly critical errors, not timeouts
      if (event.reason && event.reason.toString().includes('Network Error')) {
        console.warn('⚠️ Network error detected');
        setHasError(true);
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (hasError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center space-y-4 p-8">
          <div className="text-xl font-medium text-red-600">
            Connection Issues
          </div>
          <div className="text-gray-600 max-w-md">
            Please check your internet connection and try again.
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Reload App
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ErrorRecovery;