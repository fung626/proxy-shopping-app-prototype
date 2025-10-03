import React from 'react';

interface SimpleLoadingProps {
  message?: string;
}

export const SimpleLoading: React.FC<SimpleLoadingProps> = ({ message = "Loading..." }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto"></div>
        <div className="text-sm text-gray-600">{message}</div>
      </div>
    </div>
  );
};

export default SimpleLoading;