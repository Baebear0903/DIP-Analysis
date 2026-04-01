import React from 'react';
import { LayoutDashboard, Building2, ChevronLeft, ChevronRight, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (m: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (c: boolean) => void;
}

export function Sidebar({ activeMenu, setActiveMenu, isCollapsed, setIsCollapsed }: SidebarProps) {
  const menuItems = [
    { id: 'overview-group', label: '住院医保数据分析', icon: LayoutDashboard, sub: [
      { id: 'overview', label: '1 医保数据概览' },
      { id: 'dept-business', label: '1.2 科室业务情况' },
      { id: 'disease-distribution', label: '1.3 病种分布情况分析' },
      { id: 'cmi-analysis', label: '1.4 科室CMI指标分析' },
      { id: 'deviation-analysis', label: '1.5 偏差病例分布分析' }
    ]}
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
      className="bg-white border-r border-gray-200 flex flex-col shrink-0 overflow-hidden"
    >
      <div className="flex-1 py-4 overflow-y-auto overflow-x-hidden space-y-1 custom-scrollbar">
        {menuItems.map(item => {
          const isActiveGroup = item.sub?.some(s => s.id === activeMenu) || item.id === activeMenu;
          return (
            <div key={item.id} className="relative group px-2">
              <button 
                onClick={() => setActiveMenu(item.sub ? item.sub[0].id : item.id)}
                className={`w-full flex items-center rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
                  isActiveGroup && !item.sub 
                    ? 'text-blue-600 bg-blue-50 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-5 h-5 shrink-0 transition-all duration-300 ${isActiveGroup ? 'text-blue-600' : 'text-gray-400'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                {!isCollapsed && (
                  <motion.span 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`truncate ${isActiveGroup ? 'font-medium text-blue-600' : ''}`}
                  >
                    {item.label}
                  </motion.span>
                )}
              </button>

              {/* Collapsed Hover Menu */}
              {isCollapsed && (
                <div className="absolute left-full top-0 z-50 ml-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="w-52 bg-white border border-gray-200 rounded-lg shadow-xl py-2 overflow-hidden ring-1 ring-black/5">
                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                      {item.label}
                    </div>
                    {item.sub ? (
                      item.sub.map(sub => (
                        <button
                          key={sub.id}
                          onClick={() => setActiveMenu(sub.id)}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${activeMenu === sub.id ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
                        >
                          {sub.label}
                        </button>
                      ))
                    ) : (
                      <button
                        onClick={() => setActiveMenu(item.id)}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${activeMenu === item.id ? 'text-blue-600 bg-blue-50 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'}`}
                      >
                        进入模块
                      </button>
                    )}
                  </div>
                </div>
              )}

              {!isCollapsed && item.sub && (
                <div className="mt-1 mb-2 space-y-1">
                  {item.sub.map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveMenu(sub.id)}
                      className={`w-full flex items-center pl-11 pr-3 py-2 text-sm rounded-lg transition-all duration-200 ${
                        activeMenu === sub.id 
                          ? 'text-blue-600 font-medium bg-blue-50' 
                          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                      }`}
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
        className="h-12 border-t border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors shrink-0"
      >
        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : (
          <div className="flex items-center text-sm font-medium">
            <ChevronLeft className="w-4 h-4 mr-2" />
            收起目录
          </div>
        )}
      </button>
    </motion.aside>
  );
}
