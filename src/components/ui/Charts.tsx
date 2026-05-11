import React, { useState } from 'react';
import { 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ScatterChart as RechartsScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
  LabelList
} from 'recharts';
import { Download } from 'lucide-react';

export function DonutChart({ data, colors = ['#3b82f6', '#06b6d4', '#6366f1', '#8b5cf6', '#d946ef', '#10b981', '#f59e0b'] }: { data: any[], colors?: string[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Pre-calculate label positions to avoid overlap (Approach 4: Y-axis offset relaxation)
  let currentAngle = 90;
  const metrics = data.map((item, index) => {
    const sliceAngle = total === 0 ? 0 : (item.value / total) * 360;
    const midAngle = currentAngle - sliceAngle / 2;
    currentAngle -= sliceAngle;
    
    const RADIAN = Math.PI / 180;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    
    const isRight = cos >= 0;
    const naturalY = 116 * sin; // elbow radius (outerRadius 100 + 16)
    
    return { index, midAngle, sin, cos, isRight, naturalY, adjustedY: naturalY };
  });

  const leftSide = metrics.filter(m => !m.isRight).sort((a, b) => a.naturalY - b.naturalY);
  const rightSide = metrics.filter(m => m.isRight).sort((a, b) => a.naturalY - b.naturalY);

  const MIN_DIST = 35; // Minimum vertical distance between labels

  const relax = (side: any[]) => {
    for (let iter = 0; iter < 10; iter++) {
      for (let i = 1; i < side.length; i++) {
        const diff = side[i].adjustedY - side[i-1].adjustedY;
        if (diff < MIN_DIST) {
          const shift = (MIN_DIST - diff) / 2;
          side[i].adjustedY += shift;
          side[i-1].adjustedY -= shift;
        }
      }
    }
  };

  relax(leftSide);
  relax(rightSide);

  const adjustedMetrics: any[] = [];
  leftSide.forEach(m => adjustedMetrics[m.index] = m);
  rightSide.forEach(m => adjustedMetrics[m.index] = m);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            label={({ cx, cy, percent, index, name, value, fill }) => {
              const metric = adjustedMetrics[index];
              if (!metric) return null;
              
              const sx = cx + 100 * metric.cos;
              const sy = cy + 100 * metric.sin;
              
              // Ensure elbow point stays on a fixed radius circle to avoid intersecting the pie
              const elbowRadius = 116;
              const dy = metric.adjustedY;
              const clampedDy = Math.max(-elbowRadius, Math.min(elbowRadius, dy));
              const dx = Math.sqrt(elbowRadius * elbowRadius - clampedDy * clampedDy);
              
              const mx = cx + (metric.isRight ? dx : -dx);
              const my = cy + dy;
              
              const ex = mx + (metric.isRight ? 1 : -1) * 20;
              const ey = my;
              
              const textAnchor = metric.isRight ? 'start' : 'end';
              const textX = ex + (metric.isRight ? 1 : -1) * 8;
              
              return (
                <g>
                  <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={1} />
                  <text 
                    x={textX} 
                    y={ey} 
                    fill="#666" 
                    textAnchor={textAnchor} 
                    dominantBaseline="central"
                    fontSize={12}
                  >
                    <tspan x={textX} dy="-0.4em">{`${name}：`}</tspan>
                    <tspan x={textX} dy="1.4em">{`${value} / ${(percent * 100).toFixed(1)}%`}</tspan>
                  </text>
                </g>
              );
            }}
            labelLine={false}
            animationDuration={500}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
                stroke="#fff"
                strokeWidth={2}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0];
                const percent = item.value / total;
                
                return (
                  <div className="bg-white/95 backdrop-blur-md border border-gray-100 p-3 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] ring-1 ring-black/5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.payload.fill }} />
                      <p className="text-sm font-bold text-gray-900">{item.name}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-xs text-gray-500">数值</span>
                        <span className="text-xs font-bold text-gray-900">{item.value}</span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-xs text-gray-500">占比</span>
                        <span className="text-xs font-bold text-blue-600">
                          {(percent * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function GroupedBarChart({ data }: { data: any[] }) {
  return (
    <div className="h-80 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
            domain={[0, 'auto']}
            tickFormatter={(value) => value.toFixed(4)}
          />
          <Tooltip 
             cursor={{ fill: '#f9fafb' }}
             contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
             formatter={(value: number) => value.toFixed(4)}
          />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle" 
            wrapperStyle={{ paddingBottom: '20px' }} 
          />
          <Bar dataKey="current" name="今年" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32}>
            <LabelList dataKey="current" position="top" fill="#6b7280" fontSize={10} formatter={(val: number) => val.toFixed(4)} />
          </Bar>
          <Bar dataKey="last" name="去年" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={32}>
            <LabelList dataKey="last" position="top" fill="#6b7280" fontSize={10} formatter={(val: number) => val.toFixed(4)} />
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarChart({ data }: { data: any[] }) {
  return (
    <div className="h-80 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 10 }} 
            angle={-45}
            textAnchor="end"
            interval={0}
          />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 10 }} />
          <Tooltip 
            cursor={{ fill: '#f9fafb' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
          />
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="value" position="top" fill="#6b7280" fontSize={10} />
          </Bar>
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function HorizontalBarChart({ data }: { data: any[] }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex flex-col h-full justify-between py-1">
      {data.slice(0, 20).map((d, i) => (
        <div key={i} className="flex flex-col gap-1 group">
          <div className="flex items-center justify-between px-0.5">
            <span className="text-[11px] font-medium text-gray-600 truncate max-w-[75%]" title={d.name}>
              {d.name}
            </span>
            <span className="text-[11px] font-bold text-gray-900 tabular-nums">
              {d.value.toLocaleString()}
            </span>
          </div>
          <div className="relative h-1.5 w-full bg-gray-100/80 rounded-full overflow-hidden">
            <div 
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_-2px_rgba(59,130,246,0.5)] ${d.highlight ? 'bg-rose-500' : 'bg-blue-500'}`}
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ScatterChart({ data, xLabel, yLabel, xUnit = '', yUnit = '', xReference, yReference }: { data: any[], xLabel: string, yLabel: string, xUnit?: string, yUnit?: string, xReference?: number, yReference?: number }) {
  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name={xLabel} 
            unit={xUnit} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 10 }}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name={yLabel} 
            unit={yUnit}
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickFormatter={(value) => value.toFixed(4)}
          />
          <ZAxis type="number" range={[400, 400]} />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white/95 backdrop-blur-md border border-gray-100 p-3 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] ring-1 ring-black/5">
                    <p className="text-sm font-bold text-gray-900 mb-2">{data.name}</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-xs text-gray-500">{xLabel}</span>
                        <span className="text-xs font-bold text-gray-900">{data.x}{xUnit}</span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-xs text-gray-500">{yLabel}</span>
                        <span className="text-xs font-bold text-gray-900">{typeof data.y === 'number' ? data.y.toFixed(4) : data.y}{yUnit}</span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          {xReference !== undefined && <ReferenceLine x={xReference} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1} />}
          {yReference !== undefined && <ReferenceLine y={yReference} stroke="#ef4444" strokeDasharray="3 3" strokeWidth={1} />}
          <Scatter name="数据点" data={data} fill="#3b82f6" fillOpacity={0.6} stroke="#2563eb">
            <LabelList dataKey="label" position="top" fill="#6b7280" fontSize={10} offset={10} />
          </Scatter>
        </RechartsScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Table({ title, headers, rows, pageSize = 5, pagination = true, showDownload = false, downloadFilename = "data" }: { title?: React.ReactNode, headers: string[], rows: React.ReactNode[][], pageSize?: number, pagination?: boolean, showDownload?: boolean, downloadFilename?: string }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(rows.length / pageSize);
  
  const currentRows = pagination ? rows.slice((currentPage - 1) * pageSize, currentPage * pageSize) : rows;

  const handleDownload = () => {
    // Extract text content from React nodes if necessary
    const extractText = (node: any): string => {
      if (typeof node === 'string' || typeof node === 'number') return String(node);
      if (React.isValidElement(node)) {
        if (node.props && node.props.children) {
          if (Array.isArray(node.props.children)) {
            return node.props.children.map(extractText).join('');
          }
          return extractText(node.props.children);
        }
      }
      return '';
    };

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${extractText(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${downloadFilename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full">
      {(title || showDownload) && (
        <div className="flex items-center justify-between mb-4">
          {title ? (
            typeof title === 'string' ? <h3 className="text-sm font-medium text-gray-700">{title}</h3> : title
          ) : <div />}
          {showDownload && (
            <button 
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
            >
              <Download className="w-4 h-4" />
              下载数据
            </button>
          )}
        </div>
      )}
      <div className="w-full overflow-x-auto rounded-lg ring-1 ring-gray-200">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              {headers.map((h, i) => (
                <th key={i} className="px-4 py-3 font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, i) => (
              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-3 text-gray-900 whitespace-nowrap">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-2">
          <p className="text-xs text-gray-500">
            共 <span className="font-semibold text-gray-900">{rows.length}</span> 条记录
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
              </svg>
            </button>
            <div className="flex items-center gap-1 px-2">
              <span className="text-xs font-semibold text-blue-600">{currentPage}</span>
              <span className="text-xs text-gray-400">/</span>
              <span className="text-xs text-gray-500">{totalPages}</span>
            </div>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
