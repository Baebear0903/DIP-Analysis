import React, { useState, useRef, useEffect } from 'react';
import { Card, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { DonutChart, BarChart, HorizontalBarChart, ScatterChart, Table, GroupedBarChart } from './ui/Charts';
import { ChevronDown, ChevronRight, Search } from 'lucide-react';
import { FilterBar } from './ui/FilterBar';
import { treeData, getValidLabels } from '../constants';

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
      { label: "次均总费用", value: "11,692", trend: { value: "同比 -140", isPositive: true }, colSpan: 2 }
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
      { label: "次均分值", value: "96.6", trend: { value: "同比 +2.3", isPositive: false }, colSpan: 2 }
    ]
  },
  {
    title: "整体 CMI",
    value: "1.1500",
    trend: { value: "同比 +0.0500", isPositive: false },
    subs: [
      { label: "广州医保CMI", value: "1.1200" },
      { label: "省内异地CMI", value: "1.2100" }
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
    trend: { value: "同比 +0.0600", isPositive: false },
    subs: [
      { label: "去年同期", value: "1.1400" }
    ]
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

const allDepartments = [
  '心血管内科', '呼吸内科', '消化内科', '神经内科', '血液内科', '肾内科', '内分泌科', '风湿免疫科', '感染内科',
  '骨科', '普外科', '泌尿外科', '神经外科', '胸外科', '心脏外科', '烧伤科', '整形外科', '运动医学科',
  '妇产科', '儿科', '急诊科', '重症医学科', '眼科', '耳鼻喉科', '口腔科', '皮肤科', '肿瘤科', '康复医学科'
];

const dept1BarData = allDepartments.map((name, i) => ({
  name,
  value: Math.floor(1500 - i * 40 + Math.random() * 50)
})).sort((a, b) => b.value - a.value);

const dept1ScatterData = allDepartments.map((name, i) => ({
  name,
  x: Math.floor(Math.random() * 600000 - 150000),
  y: Number((Math.random() * 1.5 + 0.5).toFixed(4))
}));

const diseaseBarData = Array.from({ length: 20 }).map((_, i) => ({
  name: `病种${i + 1}`,
  value: Math.floor(Math.random() * 500 + 50)
})).sort((a, b) => b.value - a.value);

const diseaseScatterData = Array.from({ length: 20 }).map((_, i) => ({
  name: `病种${i + 1}`,
  x: Math.floor(Math.random() * 400000 - 100000),
  y: Number((Math.random() * 1.5 + 0.5).toFixed(4))
}));

const tcmDiseaseBarData = Array.from({ length: 20 }).map((_, i) => ({
  name: `中医病种${i + 1}`,
  value: Math.floor(Math.random() * 800 + 100)
})).sort((a, b) => b.value - a.value);

const tcmDiseaseScatterData = Array.from({ length: 20 }).map((_, i) => ({
  name: `中医病种${i + 1}`,
  x: Math.floor(Math.random() * 200000 - 50000),
  y: Number((Math.random() * 1.5 + 0.5).toFixed(4))
}));

const table1Data = dept1ScatterData.map(d => [
  d.name,
  (Math.random() * 10000000 + 5000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  d.y.toFixed(4),
  <span className={d.x >= 0 ? "text-emerald-600 font-medium" : "text-rose-600 font-medium"}>
    {d.x > 0 ? '+' : ''}{d.x.toLocaleString()}
  </span>
]);

const table2Data = dept1ScatterData.map(d => [
  d.name,
  (Math.random() * 1000 + 200).toFixed(0),
  (Math.random() * 5000000 + 1000000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  (Math.random() * 50000 + 10000).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
  (d.y * 0.8).toFixed(4)
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
        label: `BZ${String(i + 1).padStart(3, '0')}`,
        x: d.x * multiplier, // 结余
        y: d.y  // CMI
      }));
    }
    if (scatterDimension === 'tcm') {
      return tcmDiseaseScatterData.map((d, i) => ({
        name: `ZY${String(i + 1).padStart(3, '0')} - ${d.name}`,
        label: `ZY${String(i + 1).padStart(3, '0')}`,
        x: d.x * multiplier, // 结余
        y: d.y  // CMI
      }));
    }

    return sourceData.map(d => ({
      name: d.name,
      label: d.name,
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
      <FilterBar selectedDept={selectedDept} setSelectedDept={setSelectedDept} />

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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-6">
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-sm font-medium text-gray-700 mb-4 shrink-0">医保人次Top20科室</h4>
            <div className="flex-1 min-h-0">
              <HorizontalBarChart data={dept1BarData.filter(d => isAll || validLabels.includes(d.name)).slice(0, 20).map(d => ({ ...d, value: d.value * multiplier }))} />
            </div>
          </div>
          <div className="lg:col-span-3 flex flex-col justify-center">
            <Table title={<h4 className="text-sm font-medium text-gray-700">Top20科室明细</h4>} headers={['科室', '总费用(元)', 'CMI', '测算结余情况(元)']} rows={filteredTable1Data.slice(0, 20)} pageSize={10} showDownload downloadFilename="医保人次Top20科室明细" />
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>中医优势病种分析</CardTitle>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-6">
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-sm font-medium text-gray-700 mb-4 shrink-0">中医病种Top20科室</h4>
            <div className="flex-1 min-h-0">
              <HorizontalBarChart data={dept1BarData.filter(d => isAll || validLabels.includes(d.name)).slice(0, 20).map(d => ({ ...d, value: d.value * multiplier }))} />
            </div>
          </div>
          <div className="lg:col-span-3 flex flex-col justify-center">
            <Table title={<h4 className="text-sm font-medium text-gray-700">中医病种Top20科室明细</h4>} headers={['科室', '中医病种人次', '中医病种总费用', '中医病种总分值', '中医病种CMI']} rows={filteredTable2Data.slice(0, 20)} pageSize={10} showDownload downloadFilename="入组中医病种Top20科室明细" />
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>入组病种分析</CardTitle>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-6">
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-sm font-medium text-gray-700 mb-4 shrink-0">入组前20病种</h4>
            <div className="flex-1 min-h-0">
              <HorizontalBarChart data={filteredDiseaseBarData.map(d => {
                const numMatches = d.name.match(/\d+/);
                const num = numMatches ? parseInt(numMatches[0], 10) : 1;
                return { ...d, name: `BZ${String(num).padStart(3, '0')} - ${d.name}` };
              })} />
            </div>
          </div>
          <div className="lg:col-span-3 flex flex-col justify-center">
            <Table title={<h4 className="text-sm font-medium text-gray-700">入组病种Top20明细</h4>} headers={['病种编码及名称', '人次', '总费用', '总分值', '测算结余情况']} rows={filteredTable3Data} pageSize={10} showDownload downloadFilename="入组前20病种明细" />
          </div>
        </div>
      </Card>

      <Card>
        <CardTitle>入组中医病种分析</CardTitle>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-6">
          <div className="lg:col-span-2 flex flex-col">
            <h4 className="text-sm font-medium text-gray-700 mb-4 shrink-0">入组前20中医病种</h4>
            <div className="flex-1 min-h-0">
              <HorizontalBarChart data={filteredTcmDiseaseBarData.map(d => {
                const numMatches = d.name.match(/\d+/);
                const num = numMatches ? parseInt(numMatches[0], 10) : 1;
                return { ...d, name: `ZY${String(num).padStart(3, '0')} - ${d.name}` };
              })} />
            </div>
          </div>
          <div className="lg:col-span-3 flex flex-col justify-center">
            <Table title={<h4 className="text-sm font-medium text-gray-700">入组中医病种Top20明细</h4>} headers={['病种编码及名称', '人次', '总费用', '总分值', '测算结余情况']} rows={filteredTable4Data} pageSize={10} showDownload downloadFilename="入组前20中医病种明细" />
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <CardTitle>CMI 与结余分析</CardTitle>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setScatterDimension('department')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${scatterDimension === 'department' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              全部科室
            </button>
            <button
              onClick={() => setScatterDimension('comprehensive')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${scatterDimension === 'comprehensive' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Top20病种
            </button>
            <button
              onClick={() => setScatterDimension('tcm')}
              className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all ${scatterDimension === 'tcm' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
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
