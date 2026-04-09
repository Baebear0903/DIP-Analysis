import React, { useState, useRef } from 'react';
import { UploadCloud, FileSpreadsheet, CheckCircle2, Loader2 } from 'lucide-react';
import { Card, CardTitle } from './ui/Card';

const IMPORT_TYPES = [
  "医保办统计明细表",
  "医保办统计明细转科表",
  "医保局下发二级职工表",
  "医保局下发二级居民表"
];

const YEARS = ["2023", "2024", "2025", "2026"];

const HEADERS_MAP: Record<string, string[]> = {
  "医保办统计明细表": ['序号', '患者姓名', '住院号', '科室', '总费用', '医保支付', '自费金额', '结算日期'],
  "医保办统计明细转科表": ['序号', '患者姓名', '住院号', '转出科室', '转入科室', '转科时间', '总费用', '结算日期'],
  "医保局下发二级职工表": ['序号', '参保人', '个人编号', '险种类型', '就诊类别', '医疗总费用', '统筹基金支付', '结算时间'],
  "医保局下发二级居民表": ['序号', '参保人', '个人编号', '险种类型', '就诊类别', '医疗总费用', '统筹基金支付', '结算时间']
};

// Mock data generator for preview
const generateMockPreview = (type: string) => {
  const headers = HEADERS_MAP[type] || HEADERS_MAP["医保办统计明细表"];
  const rows = Array.from({ length: 10 }).map((_, i) => {
    if (type === "医保办统计明细转科表") {
      return [
        (i + 1).toString(),
        `患者${Math.floor(Math.random() * 1000)}`,
        `ZY${Math.floor(Math.random() * 1000000)}`,
        ['急诊科', '重症医学科'][Math.floor(Math.random() * 2)],
        ['心血管内科', '呼吸内科'][Math.floor(Math.random() * 2)],
        `2026-04-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        (Math.random() * 10000 + 5000).toFixed(2),
        `2026-04-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
      ];
    } else if (type.includes("医保局")) {
      return [
        (i + 1).toString(),
        `参保人${Math.floor(Math.random() * 1000)}`,
        `44010019900101${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
        type.includes("职工") ? '职工医保' : '居民医保',
        '住院',
        (Math.random() * 10000 + 5000).toFixed(2),
        (Math.random() * 8000 + 3000).toFixed(2),
        `2026-04-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
      ];
    }
    // Default: 医保办统计明细表
    return [
      (i + 1).toString(),
      `患者${Math.floor(Math.random() * 1000)}`,
      `ZY${Math.floor(Math.random() * 1000000)}`,
      ['心血管内科', '呼吸内科', '骨科', '神经内科'][Math.floor(Math.random() * 4)],
      (Math.random() * 10000 + 5000).toFixed(2),
      (Math.random() * 8000 + 3000).toFixed(2),
      (Math.random() * 2000 + 500).toFixed(2),
      `2026-04-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
    ];
  });
  return { headers, rows };
};

export function DetailManagement() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(YEARS[1]);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<{ headers: string[], rows: string[][] } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (!selectedType) {
        alert("请先选择数据类型");
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      setFile(files[0]);
      // Mock parsing
      setPreviewData(generateMockPreview(selectedType));
    }
  };

  const handleConfirm = () => {
    if (!selectedType) {
      alert("请选择数据类型");
      return;
    }
    if (!file) {
      alert("请先上传文件");
      return;
    }
    
    setIsUploading(true);
    
    // Mock save process
    setTimeout(() => {
      setIsUploading(false);
      setFile(null);
      setPreviewData(null);
      setSelectedType("");
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setToastMessage("数据导入成功！");
      setTimeout(() => setToastMessage(null), 3000);
    }, 1500);
  };

  const needsYearSelect = selectedType === "医保办统计明细表" || selectedType === "医保办统计明细转科表";

  return (
    <div className="h-full flex flex-col relative max-w-5xl mx-auto w-full">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-emerald-50 text-emerald-600 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <Card>
        <div className="border-b border-gray-100 pb-4 mb-6">
          <CardTitle>医保数据导入</CardTitle>
        </div>

        <div className="space-y-8">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">数据类型<span className="text-rose-500 ml-1">*</span></label>
              <select 
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setFile(null);
                  setPreviewData(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className={`w-full text-sm border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2.5 px-3 bg-white outline-none transition-all ${!selectedType ? 'text-gray-400' : 'text-gray-900'}`}
              >
                <option value="" disabled>请选择</option>
                {IMPORT_TYPES.map(type => <option key={type} value={type} className="text-gray-900">{type}</option>)}
              </select>
            </div>

            {needsYearSelect && (
              <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
                <label className="text-sm font-semibold text-gray-700">所属年份<span className="text-rose-500 ml-1">*</span></label>
                <select 
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2.5 px-3 bg-white outline-none transition-all text-gray-900"
                >
                  {YEARS.map(y => <option key={y} value={y}>{y}年</option>)}
                </select>
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">上传文件<span className="text-rose-500 ml-1">*</span></label>
            {!file ? (
              <div 
                className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all ${selectedType ? 'border-gray-300 hover:border-blue-500 hover:bg-blue-50/50 cursor-pointer group' : 'border-gray-200 bg-gray-50/50 cursor-not-allowed opacity-60'}`}
                onClick={() => selectedType && fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".xlsx, .xls, .csv" 
                  onChange={handleFileSelect}
                  disabled={!selectedType}
                />
                <div className={`p-4 rounded-full mb-4 transition-colors ${selectedType ? 'bg-gray-50 group-hover:bg-blue-100' : 'bg-gray-100'}`}>
                  <UploadCloud className={`w-8 h-8 transition-colors ${selectedType ? 'text-gray-400 group-hover:text-blue-600' : 'text-gray-300'}`} />
                </div>
                <p className="text-base font-medium text-gray-900 mb-1">点击或拖拽文件到此处上传</p>
                <p className="text-sm text-gray-500">支持 .xlsx, .xls, .csv 格式文件，单文件最大 50MB</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-5 border border-blue-100 bg-blue-50/50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-lg shadow-sm">
                    <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setFile(null); setPreviewData(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1.5 hover:bg-blue-100 rounded-md transition-colors"
                >
                  重新上传
                </button>
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">数据预览</label>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md">仅展示前 10 条数据</span>
            </div>
            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-200">
                      {!selectedType ? (
                        <th className="py-3 px-4 text-xs font-bold text-gray-400 whitespace-nowrap text-center">请先选择数据类型</th>
                      ) : (
                        HEADERS_MAP[selectedType].map((h, i) => (
                          <th key={i} className="py-3 px-4 text-xs font-bold text-gray-600 whitespace-nowrap">{h}</th>
                        ))
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {!selectedType ? (
                      <tr>
                        <td className="py-8 px-4 text-sm text-gray-400 text-center bg-gray-50/30">
                          等待选择数据类型...
                        </td>
                      </tr>
                    ) : !previewData ? (
                      <tr>
                        <td colSpan={HEADERS_MAP[selectedType].length} className="py-8 px-4 text-sm text-gray-400 text-center bg-gray-50/30">
                          暂无数据，请上传文件
                        </td>
                      </tr>
                    ) : (
                      previewData.rows.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          {row.map((cell, j) => (
                            <td key={j} className="py-3 px-4 text-sm text-gray-600 whitespace-nowrap">{cell}</td>
                          ))}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button 
              onClick={handleConfirm}
              disabled={!file || isUploading}
              className="flex items-center gap-2 px-8 py-2.5 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  导入中...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  导入数据
                </>
              )}
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}
