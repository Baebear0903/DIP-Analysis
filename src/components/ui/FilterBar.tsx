import React from 'react';
import { Search } from 'lucide-react';
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
          <label className="text-sm font-semibold text-gray-600">时间范围</label>
          <div className="flex items-center gap-2">
            <select className="text-sm border-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1.5 pl-3 pr-8 bg-white">
              <option>2023年</option>
              <option>2024年</option>
              <option>2025年</option>
            </select>
            <select className="text-sm border-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1.5 pl-3 pr-8 bg-white">
              <option>全年</option>
              <option>第一季度</option>
              <option>第二季度</option>
              <option>第三季度</option>
              <option>第四季度</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-600">科室</label>
          <div className="flex items-center gap-4">
            <TreeSelect data={treeData} value={selectedDept} onChange={setSelectedDept} />
            <span className="text-[10px] text-gray-400 whitespace-nowrap">选中科室后，可以查看对应科室数据</span>
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
