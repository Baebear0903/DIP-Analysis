import React, { useState, useRef, useEffect } from 'react';
import { Card, CardTitle } from './ui/Card';
import { Table } from './ui/Charts';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';

const treeData = [
  {
    label: '全院（3院区）',
    value: 'all',
    children: [
      {
        label: '天河院区',
        value: 'tianhe',
        children: [
          { label: '心血管内科', value: 'xxgnk' },
          { label: '呼吸内科', value: 'hxnk' },
          { label: '消化内科', value: 'xhnk' },
        ]
      },
      {
        label: '珠玑院区',
        value: 'zhuji',
        children: [
          { label: '骨科', value: 'gk' },
          { label: '普外科', value: 'pwk' },
          { label: '泌尿外科', value: 'mnwk' },
        ]
      },
      {
        label: '同德院区',
        value: 'tongde',
        children: [
          { label: '妇产科', value: 'fck' },
          { label: '儿科', value: 'ek' },
          { label: '急诊科', value: 'jzk' },
        ]
      }
    ]
  }
];

function TreeSelect({ data, value, onChange }: { data: any[], value: string, onChange: (v: string) => void }) {
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
        className="flex items-center justify-between w-full px-3 py-1.5 bg-white border border-gray-200 rounded-md shadow-sm cursor-pointer hover:border-blue-400 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm text-gray-700 truncate">{findLabel(data, value) || '请选择科室'}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-y-auto py-1">
          {renderItems(data)}
        </div>
      )}
    </div>
  );
}

const getValidLabels = (data: any[], val: string): string[] => {
  let labels: string[] = [];
  
  const findNodeAndChildren = (items: any[], targetVal: string, isChild = false) => {
    for (const item of items) {
      if (item.value === targetVal || isChild) {
        labels.push(item.label);
        if (item.children) {
          findNodeAndChildren(item.children, targetVal, true);
        }
        if (!isChild) return true;
      } else if (item.children) {
        if (findNodeAndChildren(item.children, targetVal, false)) return true;
      }
    }
    return false;
  };
  
  findNodeAndChildren(data, val);
  return labels;
};

export function DeptBusiness() {
  const [selectedDept, setSelectedDept] = useState('all');

  const validLabels = getValidLabels(treeData, selectedDept);
  const isAll = selectedDept === 'all';
  const multiplier = isAll ? 1 : 0.15; // Simple mock multiplier for filtered data

  const formatNum = (num: number, decimals = 0) => num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const allRows = [
    ['全院（3院区）', '-', '12,458', <span className="text-rose-600 font-medium">+5.5%</span>, '100%', '14,567.02', <span className="text-emerald-600 font-medium">-0.9%</span>, '1.16', <span className="text-emerald-600 font-medium">-6.0%</span>, '9,834.01', '1,204,500', '96.68', <span className="text-emerald-600 font-medium">-0.7%</span>],
    ['天河院区', '-', '5,200', <span className="text-rose-600 font-medium">+4.2%</span>, '41.7%', '6,200.50', <span className="text-rose-600 font-medium">+1.2%</span>, '1.19', <span className="text-emerald-600 font-medium">-2.8%</span>, '4,100.20', '520,000', '100.00', <span className="text-rose-600 font-medium">+1.5%</span>],
    ['珠玑院区', '-', '4,100', <span className="text-rose-600 font-medium">+6.8%</span>, '32.9%', '4,800.30', <span className="text-emerald-600 font-medium">-2.1%</span>, '1.17', <span className="text-emerald-600 font-medium">-8.3%</span>, '3,200.50', '410,000', '100.00', <span className="text-emerald-600 font-medium">-1.2%</span>],
    ['同德院区', '-', '3,158', <span className="text-rose-600 font-medium">+6.0%</span>, '25.3%', '3,566.22', <span className="text-emerald-600 font-medium">-2.8%</span>, '1.12', <span className="text-emerald-600 font-medium">-8.3%</span>, '2,533.31', '274,500', '86.92', <span className="text-emerald-600 font-medium">-3.1%</span>],
    ['心血管内科', '1', '1,240', <span className="text-rose-600 font-medium">+2.0%</span>, '9.9%', '1,245.00', <span className="text-rose-600 font-medium">+1.0%</span>, '1.00', <span className="text-emerald-600 font-medium">-1.0%</span>, '850.00', '145,000', '116.93', <span className="text-rose-600 font-medium">+2.5%</span>],
    ['骨科', '2', '980', <span className="text-rose-600 font-medium">+5.0%</span>, '7.8%', '1,560.00', <span className="text-rose-600 font-medium">+4.0%</span>, '1.59', <span className="text-emerald-600 font-medium">-1.0%</span>, '920.00', '185,000', '188.77', <span className="text-rose-600 font-medium">+1.2%</span>],
    ['呼吸内科', '3', '850', <span className="text-rose-600 font-medium">+8.2%</span>, '6.8%', '980.50', <span className="text-emerald-600 font-medium">-3.5%</span>, '1.15', <span className="text-emerald-600 font-medium">-10.8%</span>, '680.20', '95,000', '111.76', <span className="text-emerald-600 font-medium">-2.4%</span>],
    ['消化内科', '4', '760', <span className="text-rose-600 font-medium">+3.4%</span>, '6.1%', '820.30', <span className="text-rose-600 font-medium">+1.8%</span>, '1.07', <span className="text-emerald-600 font-medium">-1.5%</span>, '560.80', '82,000', '107.89', <span className="text-rose-600 font-medium">+0.8%</span>],
    ['普外科', '5', '720', <span className="text-emerald-600 font-medium">-1.2%</span>, '5.7%', '1,150.00', <span className="text-emerald-600 font-medium">-4.5%</span>, '1.59', <span className="text-emerald-600 font-medium">-3.3%</span>, '780.00', '125,000', '173.61', <span className="text-emerald-600 font-medium">-2.1%</span>],
    ['泌尿外科', '6', '680', <span className="text-rose-600 font-medium">+7.5%</span>, '5.4%', '920.00', <span className="text-rose-600 font-medium">+5.2%</span>, '1.35', <span className="text-emerald-600 font-medium">-2.1%</span>, '640.00', '98,000', '144.11', <span className="text-rose-600 font-medium">+3.4%</span>],
    ['妇产科', '7', '650', <span className="text-rose-600 font-medium">+4.8%</span>, '5.2%', '780.00', <span className="text-rose-600 font-medium">+2.1%</span>, '1.20', <span className="text-emerald-600 font-medium">-2.5%</span>, '520.00', '75,000', '115.38', <span className="text-rose-600 font-medium">+1.1%</span>],
    ['儿科', '8', '580', <span className="text-emerald-600 font-medium">-3.5%</span>, '4.6%', '450.00', <span className="text-emerald-600 font-medium">-8.2%</span>, '0.77', <span className="text-emerald-600 font-medium">-4.8%</span>, '310.00', '42,000', '72.41', <span className="text-emerald-600 font-medium">-5.2%</span>],
    ['急诊科', '9', '520', <span className="text-rose-600 font-medium">+12.5%</span>, '4.1%', '620.00', <span className="text-rose-600 font-medium">+15.2%</span>, '1.19', <span className="text-rose-600 font-medium">+2.4%</span>, '430.00', '58,000', '111.53', <span className="text-rose-600 font-medium">+4.5%</span>],
    ['神经内科', '10', '480', <span className="text-rose-600 font-medium">+1.5%</span>, '3.8%', '750.00', <span className="text-emerald-600 font-medium">-1.2%</span>, '1.56', <span className="text-emerald-600 font-medium">-2.6%</span>, '510.00', '85,000', '177.08', <span className="text-rose-600 font-medium">+0.5%</span>],
    // Add some more mock data to demonstrate pagination
    ['内分泌科', '11', '450', <span className="text-rose-600 font-medium">+2.1%</span>, '3.6%', '680.00', <span className="text-emerald-600 font-medium">-0.5%</span>, '1.51', <span className="text-emerald-600 font-medium">-1.2%</span>, '460.00', '78,000', '173.33', <span className="text-rose-600 font-medium">+1.2%</span>],
    ['眼科', '12', '410', <span className="text-emerald-600 font-medium">-1.5%</span>, '3.3%', '520.00', <span className="text-rose-600 font-medium">+3.2%</span>, '1.26', <span className="text-rose-600 font-medium">+4.8%</span>, '350.00', '65,000', '158.53', <span className="text-emerald-600 font-medium">-0.8%</span>],
    ['耳鼻喉科', '13', '380', <span className="text-rose-600 font-medium">+5.5%</span>, '3.0%', '490.00', <span className="text-emerald-600 font-medium">-2.1%</span>, '1.28', <span className="text-emerald-600 font-medium">-7.2%</span>, '330.00', '58,000', '152.63', <span className="text-rose-600 font-medium">+2.1%</span>],
    ['口腔科', '14', '320', <span className="text-emerald-600 font-medium">-4.2%</span>, '2.5%', '380.00', <span className="text-emerald-600 font-medium">-5.5%</span>, '1.18', <span className="text-emerald-600 font-medium">-1.3%</span>, '250.00', '45,000', '140.62', <span className="text-emerald-600 font-medium">-3.5%</span>],
    ['皮肤科', '15', '290', <span className="text-rose-600 font-medium">+8.1%</span>, '2.3%', '310.00', <span className="text-rose-600 font-medium">+6.4%</span>, '1.06', <span className="text-emerald-600 font-medium">-1.5%</span>, '210.00', '38,000', '131.03', <span className="text-rose-600 font-medium">+4.2%</span>],
    ['康复医学科', '16', '250', <span className="text-rose-600 font-medium">+15.2%</span>, '2.0%', '420.00', <span className="text-rose-600 font-medium">+12.5%</span>, '1.68', <span className="text-emerald-600 font-medium">-2.3%</span>, '290.00', '52,000', '208.00', <span className="text-rose-600 font-medium">+5.8%</span>],
  ];

  const filteredRows = allRows.filter(row => validLabels.includes(row[0] as string));

  return (
    <div className="space-y-10">
      <Card>
        <div className="flex flex-wrap items-center gap-8">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-600">时间范围</label>
            <div className="flex items-center gap-2">
              <select className="text-sm border-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1.5 pl-3 pr-8 bg-white">
                <option>2023年</option>
                <option>2024年</option>
              </select>
              <select className="text-sm border-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-1.5 pl-3 pr-8 bg-white">
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

          <button className="ml-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-md active:scale-95">
            <Search className="w-4 h-4" />
            查询分析
          </button>
        </div>
      </Card>

      <Card>
        <Table 
          title={<h3 className="text-sm font-medium text-gray-500">业务整体情况</h3>}
          pagination={false}
          showDownload
          downloadFilename="业务整体情况明细"
            headers={['指标', '数值', '人次占比（%）', '同比数值', '同比增长']}
            rows={[
              ['总人次', formatNum(12458 * multiplier), '-', formatNum(11800 * multiplier), <span className="text-rose-600 font-medium">+5.5%</span>],
              ['医疗总费用（元）', formatNum(145670230 * multiplier), '-', formatNum(147000000 * multiplier), <span className="text-emerald-600 font-medium">-0.9%</span>],
              ['记账费用（元）', formatNum(98340110 * multiplier), '-', formatNum(95000000 * multiplier), <span className="text-rose-600 font-medium">+3.5%</span>],
              ['医保分值', formatNum(1204500 * multiplier), '-', formatNum(1150000 * multiplier), <span className="text-rose-600 font-medium">+4.7%</span>],
              ['广州医保-总人次', formatNum(8500 * multiplier), '68.2%', formatNum(8200 * multiplier), <span className="text-rose-600 font-medium">+3.6%</span>],
              ['广州医保-职工', formatNum(6000 * multiplier), '48.1%', formatNum(5800 * multiplier), <span className="text-rose-600 font-medium">+3.4%</span>],
              ['广州医保-居民', formatNum(2500 * multiplier), '20.1%', formatNum(2400 * multiplier), <span className="text-rose-600 font-medium">+4.1%</span>],
              ['省内异地-总人次', formatNum(3958 * multiplier), '31.8%', formatNum(3600 * multiplier), <span className="text-rose-600 font-medium">+9.9%</span>],
              ['省内异地-职工', formatNum(2100 * multiplier), '16.8%', formatNum(1900 * multiplier), <span className="text-rose-600 font-medium">+10.5%</span>],
              ['省内异地-居民', formatNum(1858 * multiplier), '14.9%', formatNum(1700 * multiplier), <span className="text-rose-600 font-medium">+9.2%</span>]
            ]}
          />
      </Card>

      <Card>
        <Table 
          title={<h3 className="text-sm font-medium text-gray-500">明细数据情况</h3>}
          pagination={true}
          pageSize={10}
          showDownload
          downloadFilename="科室明细数据情况"
          headers={['出院科室', '收治排名', '总人次', '同比增长', '业务人次占比（%）', '总费用（万元）', '同比增长', '次均费用（万元）', '同比增长', '记账费用（万元）', '总分值', '次均分值', '同比增长']}
          rows={filteredRows}
        />
      </Card>
    </div>
  );
}
