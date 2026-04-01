import React, { useState, useRef, useEffect } from 'react';
import { Card, CardTitle } from './ui/Card';
import { Table } from './ui/Charts';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { FilterBar } from './ui/FilterBar';
import { treeData, getValidLabels } from '../constants';

export function DiseaseDistribution() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [activeTab, setActiveTab] = useState('全部病种');
  const tabs = ['全部病种', '核心病种', '综合病种', '中医优势病种', '多诊断病种', '基层病种'];

  const isAll = selectedDept === 'all';
  const multiplier = isAll ? 1 : 0.15;

  const formatNum = (num: number, decimals = 0) => num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  // Mock data for Table 1: 病种分布情况
  const hospitalWideRows = [
    ['一级综合病种', formatNum(2458 * multiplier), (19.7).toFixed(1) + '%', <span className="text-rose-600 font-medium">+4.5%</span>, formatNum(24567023 * multiplier), (0.85).toFixed(2), (5.2).toFixed(1), formatNum(9994.72)],
    ['三级核心病种', formatNum(1850 * multiplier), (14.8).toFixed(1) + '%', <span className="text-rose-600 font-medium">+6.2%</span>, formatNum(45678901 * multiplier), (1.56).toFixed(2), (12.4).toFixed(1), formatNum(24691.30)],
    ['中医优势病种', formatNum(3120 * multiplier), (25.0).toFixed(1) + '%', <span className="text-rose-600 font-medium">+8.1%</span>, formatNum(31200000 * multiplier), (1.12).toFixed(2), (8.5).toFixed(1), formatNum(10000.00)],
    ['二级核心病种', formatNum(2100 * multiplier), (16.9).toFixed(1) + '%', <span className="text-emerald-600 font-medium">-1.2%</span>, formatNum(28456789 * multiplier), (1.24).toFixed(2), (9.8).toFixed(1), formatNum(13550.85)],
    ['二级综合病种', formatNum(1560 * multiplier), (12.5).toFixed(1) + '%', <span className="text-rose-600 font-medium">+2.8%</span>, formatNum(15678901 * multiplier), (0.98).toFixed(2), (6.4).toFixed(1), formatNum(10050.58)],
    ['基层病种', formatNum(980 * multiplier), (7.9).toFixed(1) + '%', <span className="text-emerald-600 font-medium">-3.5%</span>, formatNum(4567890 * multiplier), (0.65).toFixed(2), (4.1).toFixed(1), formatNum(4661.11)],
    ['多诊断病种', formatNum(390 * multiplier), (3.1).toFixed(1) + '%', <span className="text-rose-600 font-medium">+12.5%</span>, formatNum(8901234 * multiplier), (1.45).toFixed(2), (15.2).toFixed(1), formatNum(22823.68)],
  ];

  // Mock data for Table 2: 病种入组Top25
  const top25Rows = Array.from({ length: 25 }).map((_, idx) => {
    const codes = ['A01.001', 'B02.002', 'C03.003', 'D04.004', 'E05.005'];
    return [
      idx + 1,
      codes[idx % 5] + (idx + 1),
      formatNum((100000 + Math.random() * 500000) * multiplier),
      (0.8 + Math.random() * 1.5).toFixed(2),
      (3 + Math.random() * 15).toFixed(1),
      formatNum(5000 + Math.random() * 20000),
      (1.2 + Math.random() * 5).toFixed(1) + '%',
      '心血管内科, 呼吸内科, 消化内科',
      <span className={idx % 2 === 0 ? "text-emerald-600" : "text-rose-600"}>{idx % 2 === 0 ? '+' : '-'}{formatNum(Math.random() * 10000 * multiplier)}</span>,
      formatNum((2000 + Math.random() * 5000) * multiplier),
      formatNum((1500 + Math.random() * 3000) * multiplier),
      formatNum((500 + Math.random() * 1000) * multiplier),
      formatNum((300 + Math.random() * 800) * multiplier),
      formatNum((400 + Math.random() * 1200) * multiplier),
      formatNum((1000 + Math.random() * 5000) * multiplier),
      formatNum((200 + Math.random() * 600) * multiplier),
    ];
  });

  // Mock data for Table 3: 中医优势病种收治情况
  const tcmAdvantageRows = [
    ['全院(3院区)', '-', formatNum(12458 * multiplier), formatNum(3120 * multiplier), formatNum(156 * multiplier), '25.0%', '100%'],
    ['天河院区', '-', formatNum(5200 * multiplier), formatNum(1450 * multiplier), formatNum(65 * multiplier), '27.9%', '46.5%'],
    ['珠玑院区', '-', formatNum(4100 * multiplier), formatNum(980 * multiplier), formatNum(48 * multiplier), '23.9%', '31.4%'],
    ['同德院区', '-', formatNum(3158 * multiplier), formatNum(690 * multiplier), formatNum(43 * multiplier), '21.8%', '22.1%'],
    ['心血管内科', '1', formatNum(1240 * multiplier), formatNum(450 * multiplier), formatNum(12 * multiplier), '36.3%', '14.4%'],
    ['骨科', '2', formatNum(980 * multiplier), formatNum(320 * multiplier), formatNum(8 * multiplier), '32.7%', '10.3%'],
    ['呼吸内科', '3', formatNum(850 * multiplier), formatNum(280 * multiplier), formatNum(5 * multiplier), '32.9%', '9.0%'],
    ['消化内科', '4', formatNum(760 * multiplier), formatNum(240 * multiplier), formatNum(4 * multiplier), '31.6%', '7.7%'],
    ['普外科', '5', formatNum(720 * multiplier), formatNum(210 * multiplier), formatNum(3 * multiplier), '29.2%', '6.7%'],
    ['泌尿外科', '6', formatNum(680 * multiplier), formatNum(190 * multiplier), formatNum(2 * multiplier), '27.9%', '6.1%'],
    ['妇产科', '7', formatNum(650 * multiplier), formatNum(170 * multiplier), formatNum(2 * multiplier), '26.2%', '5.4%'],
    ['儿科', '8', formatNum(580 * multiplier), formatNum(150 * multiplier), formatNum(1 * multiplier), '25.9%', '4.8%'],
    ['急诊科', '9', formatNum(520 * multiplier), formatNum(130 * multiplier), formatNum(1 * multiplier), '25.0%', '4.2%'],
  ];

  const validLabels = getValidLabels(treeData, selectedDept);
  const filteredTcmRows = tcmAdvantageRows.filter(row => validLabels.includes(row[0] as string));

  return (
    <div className="space-y-10">
      <FilterBar selectedDept={selectedDept} setSelectedDept={setSelectedDept} />

      <Card>
        <Table 
          title={<h3 className="text-sm font-medium text-gray-500">病种分布情况</h3>}
          pagination={false}
          showDownload
          downloadFilename="病种分布情况"
          headers={['病种类型', '病种人次', '病种人次占比(%)', '同比增长率', '病种费用', 'CMI', '平均住院天数', '次均费用(元)']}
          rows={hospitalWideRows}
        />
      </Card>

      <Card>
        <Table 
          title={
            <div className="flex items-center gap-6">
              <h3 className="text-sm font-medium text-gray-500 whitespace-nowrap">病种入组Top25</h3>
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
          pagination={false}
          showDownload
          downloadFilename={`病种入组Top25-${activeTab}`}
          headers={['病种入组排名', '病种编码', '病种总费用', 'CMI', '平均住院天数', '次均费用(元)', '占整体病种比例(%)', '主要收治科室(前3)', '病种超额/结余情况(元)', '医药费用', '治疗费用', '治疗费用-中医治疗费用', '化验费', '检查费', '手术费', '卫生材料费']}
          rows={top25Rows}
        />
      </Card>

      <Card>
        <Table 
          title={<h3 className="text-sm font-medium text-gray-500">中医优势病种收治情况</h3>}
          pagination={false}
          showDownload
          downloadFilename="中医优势病种收治情况"
          headers={['出院科室', '收治排名', '科室人次', '中医优势病种人次', '偏差情况(50%以下)人次', '中医病种占科室病种比例(%)', '占整体中医病种比例(%)']}
          rows={filteredTcmRows}
        />
      </Card>
    </div>
  );
}
