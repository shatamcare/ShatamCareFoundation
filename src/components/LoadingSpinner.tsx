import React from 'react';
import { Heart } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }: { 
  size?: 'sm' | 'md' | 'lg'; 
  message?: string;
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        <Heart className={`${sizeClasses[size]} text-warm-teal animate-pulse`} />
        <div className="absolute inset-0 animate-spin">
          <div className={`${sizeClasses[size]} border-2 border-warm-teal/20 border-t-warm-teal rounded-full`}></div>
        </div>
      </div>
      {message && (
        <p className="mt-4 text-sm text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
