import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { Card } from './ui/Card';
import { Table } from './ui/Charts';
import { FilterBar } from './ui/FilterBar';
import { treeData, getValidLabels } from '../constants';

export function DeviationAnalysis() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [activeDeviationTab, setActiveDeviationTab] = useState('是 (50%以下)');

  const validDepts = getValidLabels(treeData, selectedDept);
  const isAll = selectedDept === 'all';
  const multiplier = isAll ? 1 : 0.15;

  // Module 1 Data
  const deviationDistRows = validDepts.map(dept => {
    const total = Math.floor((1000 + Math.random() * 5000) * multiplier);
    const d1 = Math.floor(Math.random() * 200 * multiplier);
    const d2 = Math.floor(Math.random() * 300 * multiplier);
    const d3 = Math.floor(Math.random() * 400 * multiplier);
    const d4 = Math.floor(Math.random() * 100 * multiplier);
    const d5 = Math.floor(Math.random() * 50 * multiplier);
    const sum = d1 + d2 + d3 + d4 + d5;
    return [
      dept,
      total,
      d1,
      d2,
      d3,
      d4,
      d5,
      sum,
      ((sum / total) * 100).toFixed(2) + '%',
      ((d3 / total) * 100).toFixed(2) + '%'
    ];
  });

  // Module 2 Data
  const tcmAdvantageRows = [
    ['否 (100%至200%)', Math.floor(1245 * multiplier), `+${(45678 * multiplier).toFixed(2)}`],
    ['否 (50%至100%)', Math.floor(856 * multiplier), `+${(12345 * multiplier).toFixed(2)}`],
    ['是 (200%以上)', Math.floor(124 * multiplier), `-${(8901 * multiplier).toFixed(2)}`],
    ['是 (50%以下)', Math.floor(235 * multiplier), `+${(5678 * multiplier).toFixed(2)}`],
    ['合计', Math.floor(2460 * multiplier), `+${(54800 * multiplier).toFixed(2)}`]
  ];

  // Module 3 Data
  const deviationTabs = ['是 (50%以下)', '否 (50%至100%)', '否 (100%至200%)', '是 (200%以上)'];
  const detailRows = Array.from({ length: 15 }).map((_, i) => [
    `B${1000 + i}`,
    ((5000 + Math.random() * 10000) * multiplier).toFixed(2),
    (0.8 + Math.random() * 1.5).toFixed(4),
    (5 + Math.random() * 10).toFixed(1),
    ((4000 + Math.random() * 8000) * multiplier).toFixed(2),
    (2.5 + Math.random() * 5).toFixed(2) + '%',
    '内科, 外科, 骨科',
    ((1000 + Math.random() * 2000) * multiplier).toFixed(2),
    ((2000 + Math.random() * 3000) * multiplier).toFixed(2),
    ((500 + Math.random() * 1000) * multiplier).toFixed(2),
    ((300 + Math.random() * 600) * multiplier).toFixed(2),
    ((400 + Math.random() * 800) * multiplier).toFixed(2),
    ((800 + Math.random() * 1500) * multiplier).toFixed(2),
    ((200 + Math.random() * 400) * multiplier).toFixed(2)
  ]);

  return (
    <div className="space-y-10">
      <FilterBar selectedDept={selectedDept} setSelectedDept={setSelectedDept} />

      {/* Module 1: 中医优势病种偏差分析 */}
      <Card>
        <Table 
          title={<h3 className="text-sm font-medium text-gray-500">中医优势病种偏差分析</h3>}
          showDownload
          downloadFilename="中医优势病种偏差分析"
          headers={['出院科室', '科室总人次', '(50%以下) 人次', '(50%至100%) 人次', '(100%至200%) 人次', '(200%-250%) 人次', '(250%以上) 人次', '偏差合计', '偏差占比', '1-2倍占比']}
          rows={deviationDistRows}
          pagination={true}
          pageSize={10}
        />
      </Card>

      {/* Module 2: 中医优势病种 */}
      <Card>
        <Table 
          title={<h3 className="text-sm font-medium text-gray-500">中医优势病种</h3>}
          showDownload
          downloadFilename="中医优势病种情况统计"
          headers={['偏差情况', '中医优势病种人次', '中医优势病种超额-/结余+情况 (元)']}
          rows={tcmAdvantageRows}
        />
      </Card>

      {/* Module 3: 偏差情况 */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <h3 className="text-sm font-medium text-gray-500 mr-4">偏差情况</h3>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {deviationTabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveDeviationTab(tab)}
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${
                      activeDeviationTab === tab
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors">
              <Download className="w-4 h-4" />
              下载数据
            </button>
          </div>
          
          <Table 
            headers={['病种编码', '病种总费用', 'CMI', '平均住院天数', '次均费用 (元)', '占整体病种比例 (%)', '主要收治科室 (前3)', '医药费用', '治疗费用', '治疗费用-中医治疗费用', '化验费', '检查费', '手术费', '卫生材料费']}
            rows={detailRows}
            pagination={true}
            pageSize={10}
          />
        </div>
      </Card>
    </div>
  );
}
