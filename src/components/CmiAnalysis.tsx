import React, { useState, useRef, useEffect } from 'react';
import { Card } from './ui/Card';
import { Table } from './ui/Charts';
import { ChevronDown, ChevronRight, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { FilterBar } from './ui/FilterBar';
import { treeData } from '../constants';

export function CmiAnalysis() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [activeTab, setActiveTab] = useState('全部科室');
  const tabs = ['全部科室', '术科科室', '非术科科室'];

  const isAll = selectedDept === 'all';
  const multiplier = isAll ? 1 : 0.15;

  const trendData = [
    { year: '2020年', total: 1.3547, guangzhou: 1.3547 },
    { year: '2021年', total: 1.3920, guangzhou: 1.3920 },
    { year: '2022年', total: 1.2304, guangzhou: 1.2228 },
    { year: '2023年', total: 1.1909, guangzhou: 1.1835 },
    { year: '2024年', total: 1.1195, guangzhou: 1.1043 },
    { year: '2025年', total: 1.0870, guangzhou: 1.0686 },
    { year: '2026年', total: null, guangzhou: null },
  ].map(d => ({
    ...d,
    total: d.total ? Number((d.total * (isAll ? 1 : 0.9 + Math.random() * 0.2)).toFixed(4)) : null,
    guangzhou: d.guangzhou ? Number((d.guangzhou * (isAll ? 1 : 0.9 + Math.random() * 0.2)).toFixed(4)) : null,
  }));

  const allValues = trendData.flatMap(d => [d.total, d.guangzhou]).filter(v => v !== null) as number[];
  const minVal = Math.min(...allValues);
  const maxVal = Math.max(...allValues);
  const yMin = Math.floor(minVal / 0.5) * 0.5;
  const yMax = Math.ceil(maxVal / 0.5) * 0.5;

  const overviewData = [
    {
      title: '整体CMI',
      color: 'text-gray-900',
      items: [
        { period: '2025年上半年', cmi: 1.0921, diff: 0.0452 },
        { period: '2025年下半年', cmi: 1.0819, diff: -0.0315 },
        { period: '2025年', cmi: 1.0870, diff: 0.0137 },
      ]
    },
    {
      title: '广州医保CMI',
      color: 'text-gray-900',
      items: [
        { period: '2025年上半年', cmi: 1.0754, diff: 0.0382 },
        { period: '2025年下半年', cmi: 1.0618, diff: -0.0421 },
        { period: '2025年', cmi: 1.0686, diff: -0.0039 },
      ]
    },
    {
      title: '省内异地CMI',
      color: 'text-gray-900',
      items: [
        { period: '2025年上半年', cmi: 1.1542, diff: 0.0812 },
        { period: '2025年下半年', cmi: 1.1485, diff: 0.0754 },
        { period: '2025年', cmi: 1.1513, diff: 0.0783 },
      ]
    }
  ].map(group => ({
    ...group,
    items: group.items.map(item => {
      const cmi = Number((item.cmi * multiplier).toFixed(4));
      const diff = Number((item.diff * multiplier).toFixed(4));
      const prevCmi = cmi - diff;
      const percent = prevCmi !== 0 ? (diff / prevCmi) * 100 : 0;
      return {
        ...item,
        cmi,
        diff,
        percent
      };
    })
  }));

  const getDepts = (nodes: any[], value: string): string[] => {
    const findNode = (items: any[], val: string): any => {
      for (const item of items) {
        if (item.value === val) return item;
        if (item.children) {
          const found = findNode(item.children, val);
          if (found) return found;
        }
      }
      return null;
    };

    const getLeafLabels = (node: any): string[] => {
      if (!node.children) return [node.label];
      return node.children.flatMap(getLeafLabels);
    };

    const target = findNode(nodes, value);
    return target ? getLeafLabels(target) : [];
  };

  const currentDepts = getDepts(treeData, selectedDept);

  const tableRows = currentDepts.map((deptName) => {
    const cmi = (1.5 + Math.random() * 2).toFixed(4);
    const hospitalCmi = (1.1 + Math.random() * 0.1).toFixed(4);
    const lastYearCmi = (Number(cmi) * (0.95 + Math.random() * 0.1)).toFixed(4);
    
    return [
      deptName,
      Math.floor(500 + Math.random() * 2000),
      Math.floor(100000 + Math.random() * 900000),
      cmi,
      hospitalCmi,
      <span className={Number(cmi) > Number(hospitalCmi) ? "text-rose-600" : "text-emerald-600"}>
        CMI{Number(cmi) > Number(hospitalCmi) ? '高于' : '低于'}全院水平
      </span>,
      lastYearCmi,
      <span className={Number(cmi) > Number(lastYearCmi) ? "text-rose-600" : "text-emerald-600"}>
        CMI较去年有所{Number(cmi) > Number(lastYearCmi) ? '上升' : '下降'}
      </span>
    ];
  });

  // Generate historical data for all leaf departments
  const getAllLeafDepts = (nodes: any[]): string[] => {
    return nodes.flatMap(node => {
      if (!node.children) return [node.label];
      return getAllLeafDepts(node.children);
    });
  };

  const allLeafDepts = getAllLeafDepts(treeData);
  const years = ['2025', '2024', '2023', '2022', '2021', '2020'];
  
  const historicalRows = allLeafDepts.map(dept => {
    return [
      dept,
      ...years.map(() => (0.8 + Math.random() * 1.2).toFixed(4))
    ];
  });

  return (
    <div className="space-y-10">
      <FilterBar selectedDept={selectedDept} setSelectedDept={setSelectedDept} />

      {/* Data Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {overviewData.map((group, idx) => (
          <Card key={idx}>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2 mb-6 border-b border-gray-100 pb-4 items-center">
                <div className={`text-sm font-bold ${group.color} leading-tight flex items-center`}>{group.title}</div>
                <div className="text-xs font-bold text-gray-400 text-center flex items-center justify-center">医保CMI</div>
                <div className="text-xs font-bold text-gray-400 text-right flex items-center justify-end">同比增长</div>
              </div>
              <div className="space-y-6">
                {group.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-3 items-center">
                    <div className="text-xs text-gray-500 font-medium">{item.period}</div>
                    <div className="text-sm font-mono font-bold text-gray-900 text-center">{item.cmi.toFixed(4)}</div>
                    <div className={`text-xs font-bold text-right flex items-center justify-end gap-1 ${item.percent >= 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {item.percent >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                      {item.percent >= 0 ? '+' : ''}{item.percent.toFixed(2)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* CMI Trend Analysis */}
      <Card>
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500">CMI 趋势分析</h3>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} domain={[yMin, yMax]} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }} />
              <Line 
                type="monotone" 
                dataKey="total" 
                name="广州医保+省内异地 医保CMI值" 
                stroke="#3b82f6" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              >
                <LabelList dataKey="total" position="top" style={{ fontSize: '11px', fill: '#3b82f6', fontWeight: 500 }} />
              </Line>
              <Line 
                type="monotone" 
                dataKey="guangzhou" 
                name="广州医保 医保CMI值" 
                stroke="#f43f5e" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              >
                <LabelList dataKey="guangzhou" position="bottom" style={{ fontSize: '11px', fill: '#f43f5e', fontWeight: 500 }} />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Department CMI Analysis */}
      <Card>
        <Table 
          title={
            <div className="flex items-center gap-6">
              <h3 className="text-sm font-medium text-gray-500 whitespace-nowrap">科室CMI分析</h3>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {tabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                      activeTab === tab
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          }
          pagination={true}
          pageSize={10}
          showDownload
          downloadFilename={`科室CMI分析-${activeTab}`}
          headers={['出院科室', '科室人次', '科室总分值', '科室CMI', '全院CMI', '比较', '去年科室CMI', '比较']}
          rows={tableRows}
        />
      </Card>

      {/* Historical Data Detail */}
      <Card>
        <Table 
          title={<h3 className="text-sm font-medium text-gray-500">历史数据明细</h3>}
          pagination={true}
          pageSize={10}
          showDownload
          downloadFilename="历史数据明细-各科室历年CMI"
          headers={['科 室', ...years]}
          rows={historicalRows}
        />
      </Card>
    </div>
  );
}
