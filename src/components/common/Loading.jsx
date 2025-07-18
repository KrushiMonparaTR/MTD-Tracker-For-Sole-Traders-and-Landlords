import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  return (
    <div className={`animate-spin rounded-full border-2 border-slate-700 border-t-blue-500 ${sizeClasses[size]} ${className}`}></div>
  );
};

export const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <LoadingSpinner size="xl" className="mx-auto mb-4" />
        <p className="text-gray-300 text-lg">{message}</p>
      </div>
    </div>
  );
};

export const LoadingButton = ({ isLoading, children, className = '', ...props }) => {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className={`${className} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} flex items-center justify-center space-x-2`}
    >
      {isLoading && <LoadingSpinner size="sm" />}
      <span>{children}</span>
    </button>
  );
};

export default LoadingSpinner;
