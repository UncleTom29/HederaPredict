// components/ui/select.tsx
import React from 'react';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export function Select({ value, onValueChange, className = '', children }: SelectProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onValueChange(event.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <select value={value} onChange={handleChange} className="w-full h-full opacity-0 absolute top-0 left-0">
        {children}
      </select>
      {children}
    </div>
  );
}

export function SelectTrigger({ className = '', children }: CardProps) {
  return (
    <button className={`flex items-center justify-between w-full px-3 py-2 text-sm bg-gray-700 rounded-md text-gray-200 hover:bg-gray-600 ${className}`}>
      {children}
    </button>
  );
}

export function SelectValue({ children }: CardProps) {
  return <span className="block truncate">{children}</span>;
}

export function SelectContent({ className = '', children }: CardProps) {
  return (
    <div className={`absolute z-50 w-full mt-1 bg-gray-700 rounded-md shadow-lg ${className}`}>
      {children}
    </div>
  );
}

export function SelectItem({ children }: Omit<SelectItemProps, 'value'>) {
  return (
    <div className="px-3 py-2 text-sm text-gray-200 hover:bg-gray-600 cursor-pointer">
      {children}
    </div>
  );
}