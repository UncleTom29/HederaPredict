// components/ui/tabs.tsx
import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType>({
  value: '',
  onValueChange: () => {}
});

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

export function Tabs({ defaultValue, className = '', children }: TabsProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ value, onValueChange: setValue }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export function TabsList({ className = '', children }: TabsListProps) {
  return (
    <div className={`flex space-x-2 p-1 bg-gray-700 rounded-lg ${className}`}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const { value: selectedValue, onValueChange } = useContext(TabsContext);
  const isSelected = value === selectedValue;

  return (
    <button
      className={`
        px-4 py-2 text-sm font-medium rounded-md transition-colors
        ${isSelected ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-gray-200'}
      `}
      onClick={() => onValueChange(value)}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export function TabsContent({ value, className = '', children }: TabsContentProps) {
  const { value: selectedValue } = useContext(TabsContext);

  if (value !== selectedValue) return null;

  return (
    <div className={className}>
      {children}
    </div>
  );
}