import React from 'react';

const LoadingDots = () => {
  return (
    <div className="flex space-x-2">
      <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce"></div>
      <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce delay-75"></div>
      <div className="w-2.5 h-2.5 bg-gray-500 rounded-full animate-bounce delay-150"></div>
    </div>
  );
};

export default LoadingDots;
