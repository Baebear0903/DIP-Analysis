import React, { useState, useRef, useEffect } from 'react';
import { Card, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { DonutChart, BarChart, HorizontalBarChart, ScatterChart, Table, GroupedBarChart } from './ui/Charts';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';

const treeData = [
  {
    label: '全院 (3院区)',
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

const kpiData = [
  {
    title: "医保人次",
    value: "12,458",
    subs: [
      { label: "偏差人次", value: "342" },
      { label: "其中-250%以上偏差人次", value: "12" }
    ]
  },
  {
    title: "医疗总费用 (元)",
    value: "145,670,230",
    subs: [
      { label: "次均总费用", value: "11,692", trend: { value: "同比 -1.20%", isPositive: true }, colSpan: 2 }
    ]
  },
  {
    title: "记账费用 (元)",
    value: "98,340,110",
    subs: [
      { label: "其中-250%以上偏差记账费用", value: "450,200", colSpan: 2 }
    ]
  },
  {
    title: "医保分值",
    value: "1,204,500",
    subs: [
      { label: "次均分值", value: "96.6", trend: { value: "同比 +2.40%", isPositive: false }, colSpan: 2 }
    ]
  },
  {
    title: "整体 CMI",
    value: "1.15",
    trend: { value: "同比 +4.55%", isPositive: false },
    subs: [
      { label: "广州医保CMI", value: "1.12" },
      { label: "省内异地CMI", value: "1.21" }
    ]
  },
  {
    title: "住院自费率",
    value: "15.4%",
    subs: [
      { label: "丙类项目自费率", value: "8.2%" },
      { label: "乙类项目自付率", value: "7.2%" }
    ]
  },
  {
    title: "人次人头比",
    value: "1.2",
    trend: { value: "同比 +5.20%", isPositive: false },
    subs: []
  },
  {
    title: "全院测算情况",
    value: "结余（+）",
    valueColor: "text-emerald-600",
    subs: []
  },
  {
    title: "全院灰码率",
    value: "2.1%",
    subs: []
  }
];

const pie1Data = [
  { name: '广州职工', value: 6000 },
  { name: '广州居民', value: 2500 },
  { name: '省内异地职工', value: 2100 },
  { name: '省内异地居民', value: 1858 }
];

const pie2Data = [
  { name: '一级综合', value: 1048 },
  { name: '三级核心', value: 735 },
  { name: '中医优势', value: 580 },
  { name: '二级核心', value: 484 },
  { name: '二级综合', value: 300 },
  { name: '基层病种', value: 200 },
  { name: '多诊断', value: 150 }
];

const pie3Data = [
  { name: '50%以下', value: 500 },
  { name: '50%-100%', value: 3000 },
  { name: '100%-200%', value: 6000 },
  { name: '200%-250%', value: 1500 },
  { name: '250%以上', value: 12 }
];

const cmiComparisonData = [
  { category: '整体', current: 1.15, last: 1.10 },
  { category: '广州医保', current: 1.12, last: 1.10 },
  { category: '省内异地', current: 1.21, last: 1.18 }
];

const dept1BarData = [
  { name: '心血管内科', value: 1240 },
  { name: '呼吸内科', value: 980 },
  { name: '消化内科', value: 850 },
  { name: '骨科', value: 820 },
  { name: '神经内科', value: 780 },
  { name: '普外科', value: 750 },
  { name: '妇产科', value: 710 },
  { name: '儿科', value: 680 },
  { name: '泌尿外科', value: 650 },
  { name: '内分泌科', value: 620 },
  { name: '肾内科', value: 590 },
  { name: '眼科', value: 560 },
  { name: '耳鼻喉科', value: 530 },
  { name: '神经外科', value: 490 },
  { name: '胸外科', value: 460 },
  { name: '血液内科', value: 420 },
  { name: '口腔科', value: 390 },
  { name: '皮肤科', value: 350 },
  { name: '免疫科', value: 310 },
  { name: '心脏外科', value: 280 }
];

const dept1ScatterData = [
  { name: '心血管内科', x: 340000, y: 1.35 },
  { name: '呼吸内科', x: 120000, y: 1.12 },
  { name: '消化内科', x: 80000, y: 1.08 },
  { name: '骨科', x: -50000, y: 1.45 },
  { name: '神经内科', x: 150000, y: 1.25 },
  { name: '普外科', x: -80000, y: 1.38 },
  { name: '妇产科', x: 200000, y: 0.95 },
  { name: '儿科', x: 60000, y: 0.85 },
  { name: '泌尿外科', x: 90000, y: 1.15 },
  { name: '内分泌科', x: 40000, y: 0.98 },
  { name: '肾内科', x: -30000, y: 1.22 },
  { name: '眼科', x: 110000, y: 0.88 },
  { name: '耳鼻喉科', x: 70000, y: 0.92 },
  { name: '神经外科', x: -150000, y: 1.65 },
  { name: '胸外科', x: -110000, y: 1.55 },
  { name: '血液内科', x: 20000, y: 1.42 },
  { name: '口腔科', x: 130000, y: 0.75 },
  { name: '皮肤科', x: 180000, y: 0.65 },
  { name: '免疫科', x: 10000, y: 1.18 },
  { name: '心脏外科', x: -200000, y: 1.85 }
];

const diseaseBarData = Array.from({ length: 20 }).map((_, i) => ({
  name: `综合病种${i + 1}`,
  value: Math.floor(Math.random() * 500 + 50)
})).sort((a, b) => b.value - a.value);

const diseaseScatterData = Array.from({ length: 20 }).map((_, i) => ({
  name: `综合病种${i + 1}`,
  x: Math.floor(Math.random() * 400000 - 100000),
  y: Number((Math.random() * 1.5 + 0.5).toFixed(2))
}));

const tcmDiseaseBarData = Array.from({ length: 20 }).map((_, i) => ({
  name: `中医病种${i + 1}`,
  value: Math.floor(Math.random() * 800 + 100)
})).sort((a, b) => b.value - a.value);

const tcmDiseaseScatterData = Array.from({ length: 20 }).map((_, i) => ({
  name: `中医病种${i + 1}`,
  x: Math.floor(Math.random() * 200000 - 50000),
  y: Number((Math.random() * 1.5 + 0.5).toFixed(2))
}));

const table1Data = dept1ScatterData.map(d => [
  d.name,
  (Math.random() * 10000000 + 5000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  d.y.toFixed(2),
  <span className={d.x >= 0 ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
    {d.x > 0 ? '+' : ''}{d.x.toLocaleString()}
  </span>
]);

const table2Data = dept1ScatterData.map(d => [
  d.name,
  (Math.random() * 1000 + 200).toFixed(0),
  (Math.random() * 5000000 + 1000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  (Math.random() * 50000 + 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  (d.y * 0.8).toFixed(2)
]);

const table3Data = diseaseScatterData.map((d, i) => {
  const surplus = d.x;
  return [
    `BZ${String(i + 1).padStart(3, '0')} - ${d.name}`,
    diseaseBarData.find(b => b.name === d.name)?.value.toString() || '0',
    (Math.random() * 8000000 + 1000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    (Math.random() * 80000 + 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    <span className={surplus >= 0 ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
      {surplus > 0 ? '+' : ''}{surplus.toLocaleString()}
    </span>
  ];
});

const table4Data = tcmDiseaseScatterData.map((d, i) => {
  const surplus = d.x;
  return [
    `ZY${String(i + 1).padStart(3, '0')} - ${d.name}`,
    tcmDiseaseBarData.find(b => b.name === d.name)?.value.toString() || '0',
    (Math.random() * 4000000 + 500000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    (Math.random() * 40000 + 5000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
    <span className={surplus >= 0 ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
      {surplus > 0 ? '+' : ''}{surplus.toLocaleString()}
    </span>
  ];
});

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

export function Overview() {
  const [selectedDept, setSelectedDept] = useState('all');
  const [scatterDimension, setScatterDimension] = useState<'department' | 'comprehensive' | 'tcm'>('department');

  const validLabels = getValidLabels(treeData, selectedDept);
  const isAll = selectedDept === 'all';
  const multiplier = isAll ? 1 : 0.15;

  const formatNum = (num: number, decimals = 0) => num.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const filteredKpiData = kpiData.map(kpi => {
    if (kpi.title === '整体 CMI' || kpi.title === '人次人头比') {
      const num = parseFloat(kpi.value.replace(/,/g, ''));
      return {
        ...kpi,
        value: isNaN(num) ? kpi.value : formatNum(num, 4)
      };
    }
    if (kpi.title === '住院自费率' || kpi.title === '全院测算情况' || kpi.title === '全院灰码率') {
      return kpi;
    }
    const num = parseFloat(kpi.value.replace(/,/g, ''));
    return {
      ...kpi,
      value: isNaN(num) ? kpi.value : formatNum(num * multiplier)
    };
  });

  const filteredPie1Data = pie1Data.map(d => ({ ...d, value: d.value * multiplier }));
  const filteredPie2Data = pie2Data.map(d => ({ ...d, value: d.value * multiplier }));
  const filteredPie3Data = pie3Data.map(d => ({ ...d, value: d.value * multiplier }));
  
  const filteredDiseaseBarData = diseaseBarData.map(d => ({ ...d, value: d.value * multiplier }));
  const filteredTcmDiseaseBarData = tcmDiseaseBarData.map(d => ({ ...d, value: d.value * multiplier }));

  const filteredTable1Data = isAll ? table1Data : table1Data.filter(row => validLabels.includes(row[0] as string));
  const filteredTable2Data = isAll ? table2Data : table2Data.filter(row => validLabels.includes(row[0] as string));
  
  const filteredTable3Data = table3Data.map((row, i) => {
    const newRow = [...row];
    newRow[1] = Math.floor(parseInt((newRow[1] as string).replace(/,/g, '')) * multiplier).toLocaleString();
    newRow[2] = (parseFloat((newRow[2] as string).replace(/,/g, '')) * multiplier).toFixed(2);
    newRow[3] = Math.floor(parseInt((newRow[3] as string).replace(/,/g, '')) * multiplier).toLocaleString();
    
    const surplus = diseaseScatterData[i].x * multiplier;
    newRow[4] = (
      <span className={surplus >= 0 ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
        {surplus > 0 ? '+' : ''}{surplus.toLocaleString()}
      </span>
    );
    return newRow;
  });
  
  const filteredTable4Data = table4Data.map((row, i) => {
    const newRow = [...row];
    newRow[1] = Math.floor(parseInt((newRow[1] as string).replace(/,/g, '')) * multiplier).toLocaleString();
    newRow[2] = (parseFloat((newRow[2] as string).replace(/,/g, '')) * multiplier).toFixed(2);
    newRow[3] = Math.floor(parseInt((newRow[3] as string).replace(/,/g, '')) * multiplier).toLocaleString();
    
    const surplus = tcmDiseaseScatterData[i].x * multiplier;
    newRow[4] = (
      <span className={surplus >= 0 ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
        {surplus > 0 ? '+' : ''}{surplus.toLocaleString()}
      </span>
    );
    return newRow;
  });

  const getScatterData = () => {
    let sourceData = dept1ScatterData;
    if (!isAll) {
      sourceData = sourceData.filter(d => validLabels.includes(d.name));
    }

    if (scatterDimension === 'comprehensive') {
      return diseaseScatterData.map((d, i) => ({
        name: `BZ${String(i + 1).padStart(3, '0')} - ${d.name}`,
        x: d.x * multiplier, // 结余
        y: d.y  // CMI
      }));
    }
    if (scatterDimension === 'tcm') {
      return tcmDiseaseScatterData.map((d, i) => ({
        name: `ZY${String(i + 1).padStart(3, '0')} - ${d.name}`,
        x: d.x * multiplier, // 结余
        y: d.y  // CMI
      }));
    }

    return sourceData.map(d => ({
      name: d.name,
      x: d.x, // 结余
      y: d.y  // CMI
    }));
  };

  const currentScatterData = getScatterData();
  const advantages = currentScatterData.filter(d => d.y > 1.0 && d.x > 0);
  const potentials = currentScatterData.filter(d => d.y > 1.0 && d.x < 0);
  const disadvantages = currentScatterData.filter(d => d.y < 1.0 && d.x < 0);
  const focuses = currentScatterData.filter(d => d.y < 1.0 && d.x > 0);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredKpiData.map((kpi: any, i) => (
          <Card key={i} className="flex flex-col">
            <h4 className="text-sm font-medium text-gray-500">{kpi.title}</h4>
            <div className="flex items-baseline gap-2 mt-2">
              <p className={`text-3xl font-semibold ${kpi.valueColor || 'text-gray-900'}`}>{kpi.value}</p>
              {kpi.trend && <Badge isPositive={kpi.trend.isPositive}>{kpi.trend.value}</Badge>}
            </div>
            {kpi.subs.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-2 gap-y-3 gap-x-4">
                {kpi.subs.map((sub: any, idx: number) => (
                  <div key={idx} className={`flex items-center justify-between ${sub.colSpan === 2 ? 'col-span-2' : ''}`}>
                    <span className="text-xs text-gray-500">{sub.label}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-medium text-gray-900">{sub.value}</span>
                      {sub.trend && <Badge isPositive={sub.trend.isPositive}>{sub.trend.value}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardTitle>医保类型人次和占比</CardTitle>
          <DonutChart data={filteredPie1Data} />
        </Card>
        <Card>
          <CardTitle>核心病种分布情况</CardTitle>
          <DonutChart data={filteredPie2Data} />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardTitle>偏差情况人次和占比</CardTitle>
          <DonutChart data={filteredPie3Data} />
        </Card>
        <Card>
          <CardTitle>CMI 数据分析 (今年 vs 去年)</CardTitle>
          <GroupedBarChart data={cmiComparisonData} />
        </Card>
      </div>

      <Card>
        <CardTitle>医保人次分析</CardTitle>
        <div className="flex flex-col gap-10 mt-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">医保人次前20科室</h4>
            <BarChart data={dept1BarData.filter(d => isAll || validLabels.includes(d.name)).map(d => ({ ...d, value: d.value * multiplier }))} />
          </div>
          <div>
            <Table title={<h4 className="text-sm font-medium text-gray-700">医保人次前20科室明细</h4>} headers={['科室', '总费用(元)', 'CMI', '测算结余情况(元)']} rows={filteredTable1Data} pageSize={5} showDownload downloadFilename="医保人次前20科室明细" />
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>中医优势病种分析</CardTitle>
        <div className="flex flex-col gap-10 mt-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">入组中医病种前20科室</h4>
            <BarChart data={dept1BarData.filter(d => isAll || validLabels.includes(d.name)).map(d => ({ ...d, value: d.value * multiplier }))} />
          </div>
          <div>
            <Table title={<h4 className="text-sm font-medium text-gray-700">入组中医病种前20科室明细</h4>} headers={['科室', '中医病种人次', '中医病种总费用', '中医病种总分值', '中医病种CMI']} rows={filteredTable2Data} pageSize={5} showDownload downloadFilename="入组中医病种前20科室明细" />
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>入组综合病种分析</CardTitle>
        <div className="flex flex-col gap-10 mt-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">入组前20综合病种</h4>
            <BarChart data={filteredDiseaseBarData} />
          </div>
          <div>
            <Table title={<h4 className="text-sm font-medium text-gray-700">入组前20综合病种明细</h4>} headers={['病种编码及名称', '人次', '总费用', '总分值', '测算结余情况']} rows={filteredTable3Data} pageSize={5} showDownload downloadFilename="入组前20综合病种明细" />
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>入组中医病种分析</CardTitle>
        <div className="flex flex-col gap-10 mt-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">入组前20中医病种</h4>
            <BarChart data={filteredTcmDiseaseBarData} />
          </div>
          <div>
            <Table title={<h4 className="text-sm font-medium text-gray-700">入组前20中医病种明细</h4>} headers={['病种编码及名称', '人次', '总费用', '总分值', '测算结余情况']} rows={filteredTable4Data} pageSize={5} showDownload downloadFilename="入组前20中医病种明细" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <CardTitle>CMI 与结余分析</CardTitle>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setScatterDimension('department')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${scatterDimension === 'department' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Top20科室
            </button>
            <button
              onClick={() => setScatterDimension('comprehensive')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${scatterDimension === 'comprehensive' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Top20综合病种
            </button>
            <button
              onClick={() => setScatterDimension('tcm')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${scatterDimension === 'tcm' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Top20中医病种
            </button>
          </div>
        </div>
        <div className="mt-6">
          <ScatterChart data={currentScatterData} xLabel="测算结余" yLabel="CMI" xUnit="元" xReference={0} yReference={1.0} />
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-4">
            <h5 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              优势 (CMI &gt; 1.0, 结余 &gt; 0)
            </h5>
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {advantages.length > 0 ? advantages.map((d, i) => (
                <li key={i} className="text-sm text-emerald-700/80 truncate" title={d.name}>{d.name}</li>
              )) : <li className="text-sm text-emerald-600/50">暂无数据</li>}
            </ul>
          </div>
          <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
            <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              潜力 (CMI &gt; 1.0, 结余 &lt; 0)
            </h5>
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {potentials.length > 0 ? potentials.map((d, i) => (
                <li key={i} className="text-sm text-blue-700/80 truncate" title={d.name}>{d.name}</li>
              )) : <li className="text-sm text-blue-600/50">暂无数据</li>}
            </ul>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-4">
            <h5 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              关注 (CMI &lt; 1.0, 结余 &gt; 0)
            </h5>
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {focuses.length > 0 ? focuses.map((d, i) => (
                <li key={i} className="text-sm text-amber-700/80 truncate" title={d.name}>{d.name}</li>
              )) : <li className="text-sm text-amber-600/50">暂无数据</li>}
            </ul>
          </div>
          <div className="bg-rose-50/50 border border-rose-100 rounded-lg p-4">
            <h5 className="font-semibold text-rose-800 mb-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500" />
              劣势 (CMI &lt; 1.0, 结余 &lt; 0)
            </h5>
            <ul className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {disadvantages.length > 0 ? disadvantages.map((d, i) => (
                <li key={i} className="text-sm text-rose-700/80 truncate" title={d.name}>{d.name}</li>
              )) : <li className="text-sm text-rose-600/50">暂无数据</li>}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
