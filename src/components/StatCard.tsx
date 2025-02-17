
import { FC } from 'react';

interface StatCardProps {
  number: string;
  label: string;
}

export const StatCard: FC<StatCardProps> = ({ number, label }) => {
  return (
    <div className="glass-card p-6 animate-hover">
      <h3 className="text-4xl font-bold mb-2">{number}</h3>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
};
