import React from 'react';
import { Activity, Database } from 'lucide-react';

export function Header({ activeMenu, setActiveMenu }: { activeMenu?: string, setActiveMenu?: (m: string) => void }) {
  return (
    <header className="h-14 bg-white ring-1 ring-gray-200 flex items-center px-6 shrink-0 z-10 justify-between">
      <div className="flex items-center h-full">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-lg mr-12">
          <Activity className="w-5 h-5" />
          <span>医院管理平台</span>
        </div>
        <nav className="flex h-full">
          <div 
            onClick={() => setActiveMenu && setActiveMenu('overview')}
            className={`flex items-center px-4 border-b-2 text-sm font-medium cursor-pointer ${activeMenu !== 'detail-management' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
          >
            医保DIP数据分析平台
          </div>
        </nav>
      </div>
      <div className="flex items-center">
        <button 
          onClick={() => setActiveMenu && setActiveMenu('detail-management')}
          className={`p-2 rounded-md transition-colors ${activeMenu === 'detail-management' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
          title="明细数据管理"
        >
          <Database className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
