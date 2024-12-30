// components/ui/progress.tsx
import React from 'react';

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className = '' }: ProgressProps) {
  return (
    <div className={`h-2 bg-gray-700 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}