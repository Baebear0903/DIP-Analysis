import React from 'react';
import { Search, Calendar } from 'lucide-react';
import { Card } from './Card';
import { TreeSelect } from './TreeSelect';
import { treeData } from '../../constants';

interface FilterBarProps {
  selectedDept: string;
  setSelectedDept: (dept: string) => void;
  onSearch?: () => void;
}

export function FilterBar({ selectedDept, setSelectedDept, onSearch }: FilterBarProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-8">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-600">日期:</label>
          <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md shadow-sm bg-white focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500">
            <Calendar className="w-4 h-4 text-gray-400" />
            <input 
              type="month" 
              className="text-sm border-none p-0 focus:ring-0 text-gray-600 bg-transparent outline-none w-[110px]" 
              defaultValue="2026-01" 
            />
            <span className="text-gray-400">-</span>
            <input 
              type="month" 
              className="text-sm border-none p-0 focus:ring-0 text-gray-600 bg-transparent outline-none w-[110px]" 
              defaultValue="2026-04" 
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-600">科室</label>
          <div className="flex items-center gap-4">
            <TreeSelect data={treeData} value={selectedDept} onChange={setSelectedDept} />
            <span className="text-[10px] text-gray-400 whitespace-nowrap">页面展示当前筛选科室数据</span>
          </div>
        </div>

        <button 
          onClick={onSearch}
          className="ml-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-md active:scale-95"
        >
          <Search className="w-4 h-4" />
          查询分析
        </button>
      </div>
    </Card>
  );
}
