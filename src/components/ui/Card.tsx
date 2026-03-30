import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string; key?: string | number }) {
  return (
    <div className={`bg-white ring-1 ring-gray-200 shadow-sm rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h3 className="text-sm font-medium text-gray-500">{children}</h3>
      {action && <div>{action}</div>}
    </div>
  );
}
