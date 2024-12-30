// /LoadingState.tsx
import React from 'react';

interface Props {
  message?: string;
}

export const LoadingState: React.FC<Props> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-300">{message}</p>
      </div>
    </div>
  );
};