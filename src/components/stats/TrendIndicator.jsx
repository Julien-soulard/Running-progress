import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const TrendIndicator = ({ value, previousValue, reverse = false }) => {
  const difference = value - previousValue;
  const percentage = (Math.abs(difference) / previousValue) * 100;
  const isPositive = reverse ? difference < 0 : difference > 0;

  return (
    <div className={`flex items-center space-x-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
      {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
      <span>{percentage.toFixed(1)}%</span>
    </div>
  );
};

export default TrendIndicator;