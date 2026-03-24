import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string; key?: string | number }) {
  return (
    <div className={`bg-white ring-1 ring-gray-200 shadow-sm rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-medium text-gray-500 mb-6">{children}</h3>
  );
}
