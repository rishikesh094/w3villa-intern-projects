import React from 'react';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center space-x-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="text-gray-600">{message}</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;
