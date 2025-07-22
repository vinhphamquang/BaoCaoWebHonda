import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  className,
  text = 'Đang tải...'
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-2', className)}>
      <svg
        className={cn('animate-spin text-red-600', sizes[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && (
        <p className="text-sm text-gray-600">{text}</p>
      )}
    </div>
  );
};

// Loading Skeleton Component
interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className,
  lines = 1 
}) => {
  return (
    <div className={cn('animate-pulse', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'bg-gray-200 rounded',
            index === 0 ? 'h-4' : 'h-4 mt-2'
          )}
        />
      ))}
    </div>
  );
};

// Card Loading Skeleton
export const CardSkeleton: React.FC = () => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-6">
      <div className="animate-pulse">
        <div className="bg-gray-200 rounded h-48 mb-4" />
        <div className="bg-gray-200 rounded h-6 mb-2" />
        <div className="bg-gray-200 rounded h-4 mb-2 w-3/4" />
        <div className="bg-gray-200 rounded h-4 w-1/2" />
      </div>
    </div>
  );
};

// Page Loading Component
export const PageLoading: React.FC<{ text?: string }> = ({ 
  text = 'Đang tải trang...' 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  );
};

export default Loading;
