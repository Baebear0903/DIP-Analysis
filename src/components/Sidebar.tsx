import React from 'react';
import { LayoutDashboard, Building2, ChevronLeft, ChevronRight, Database } from 'lucide-react';

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (m: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
}

export function Sidebar({ activeMenu, setActiveMenu, isCollapsed, setIsCollapsed }: SidebarProps) {
  const menuItems = [
    { id: 'overview-group', label: '住院医保数据分析', icon: LayoutDashboard, sub: [
      { id: 'overview', label: '医保数据概览' },
      { id: 'dept-business', label: '科室业务情况' }
    ]}
  ];

  return (
    <aside className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} shrink-0`}>
      <div className="flex-1 py-4 overflow-y-auto space-y-1">
        {menuItems.map(item => {
          const isActiveGroup = item.sub?.some(s => s.id === activeMenu) || item.id === activeMenu;
          return (
            <div key={item.id}>
              <button 
                onClick={() => setActiveMenu(item.sub ? item.sub[0].id : item.id)}
                className={`w-full flex items-center px-4 py-2.5 text-sm transition-colors ${isActiveGroup && !item.sub ? 'text-blue-600 bg-blue-50 font-medium border-r-2 border-blue-600' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <item.icon className={`w-5 h-5 ${isCollapsed ? 'mx-auto' : 'mr-3'} shrink-0 ${isActiveGroup ? 'text-blue-600' : 'text-gray-400'}`} />
                {!isCollapsed && <span className={isActiveGroup ? 'font-medium text-blue-600' : ''}>{item.label}</span>}
              </button>
              {!isCollapsed && item.sub && (
                <div className="mt-1 mb-2 space-y-1">
                  {item.sub.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveMenu(sub.id)}
                      className={`w-full flex items-center pl-12 pr-4 py-2 text-sm transition-colors ${activeMenu === sub.id ? 'text-blue-600 font-medium bg-blue-50/50 border-r-2 border-blue-600' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="h-12 border-t border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
      >
        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : (
          <div className="flex items-center text-sm">
            <ChevronLeft className="w-4 h-4 mr-1" />
            收起目录
          </div>
        )}
      </button>
    </aside>
  );
}
