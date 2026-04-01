import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

export function TreeSelect({ data, value, onChange }: { data: any[], value: string, onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(['all']);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleExpand = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    setExpanded(prev => 
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    );
  };

  const findLabel = (items: any[], val: string): string => {
    for (const item of items) {
      if (item.value === val) return item.label;
      if (item.children) {
        const found = findLabel(item.children, val);
        if (found) return found;
      }
    }
    return '';
  };

  const renderItems = (items: any[], level = 0) => {
    return items.map(item => (
      <div key={item.value}>
        <div 
          className={`flex items-center py-1.5 px-3 hover:bg-blue-50 cursor-pointer text-sm ${value === item.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => {
            onChange(item.value);
            if (!item.children) setIsOpen(false);
          }}
        >
          {item.children ? (
            <button onClick={(e) => toggleExpand(e, item.value)} className="mr-1 p-0.5 hover:bg-gray-200 rounded">
              {expanded.includes(item.value) ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
          ) : <div className="w-4" />}
          <span>{item.label}</span>
        </div>
        {item.children && expanded.includes(item.value) && renderItems(item.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="relative w-72" ref={containerRef}>
      <div 
        className="flex items-center justify-between border border-gray-200 rounded-md shadow-sm py-1.5 px-3 bg-white cursor-pointer hover:border-blue-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm text-gray-700 truncate">{findLabel(data, value) || '请选择科室'}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto py-1">
          {renderItems(data)}
        </div>
      )}
    </div>
  );
}
