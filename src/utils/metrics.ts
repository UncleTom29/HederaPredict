export interface Metric {
  label: string;
  value: string;
  color?: string;
}

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};


export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
};