// components/ui/alert.tsx
import React from 'react';

interface AlertProps {
  variant?: 'default' | 'destructive';
  className?: string;
  children: React.ReactNode;
}

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Alert({ variant = 'default', className = '', children }: AlertProps) {
  const variantStyles = {
    default: 'bg-gray-800 text-gray-200',
    destructive: 'bg-red-900 text-red-200'
  };

  return (
    <div className={`p-4 rounded-lg ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}

export function AlertTitle({ className = '', children }: CardProps) {
  return (
    <h5 className={`font-medium mb-1 ${className}`}>
      {children}
    </h5>
  );
}

export function AlertDescription({ className = '', children }: CardProps) {
  return (
    <div className={`text-sm opacity-90 ${className}`}>
      {children}
    </div>
  );
}