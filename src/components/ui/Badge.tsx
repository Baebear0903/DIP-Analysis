import React from 'react';

export function Badge({ children, isPositive }: { children: React.ReactNode; isPositive?: boolean; key?: string | number }) {
  const base = "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium";
  const color = isPositive 
    ? "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-500/20" 
    : "bg-rose-50 text-rose-600 ring-1 ring-inset ring-rose-500/20";
  return (
    <span className={`${base} ${color}`}>
      {children}
    </span>
  );
}
