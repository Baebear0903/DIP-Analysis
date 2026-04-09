import React, { useState, useRef } from 'react';
import { ChevronDown, UploadCloud, FileSpreadsheet, X, CheckCircle2 } from 'lucide-react';

const IMPORT_TYPES = [
  "医保办统计明细表",
  "医保办统计明细转科表",
  "医保局下发二级职工表",
  "医保局下发二级居民表"
];

const YEARS = ["2023", "2024", "2025", "2026"];

// Mock data generator for preview
const generateMockPreview = (type: string) => {
  const headers = ['序号', '患者姓名', '住院号', '科室', '总费用', '医保支付', '自费金额', '结算日期'];
  const rows = Array.from({ length: 10 }).map((_, i) => [
    (i + 1).toString(),
    `患者${Math.floor(Math.random() * 1000)}`,
    `ZY${Math.floor(Math.random() * 1000000)}`,
    ['心血管内科', '呼吸内科', '骨科', '神经内科'][Math.floor(Math.random() * 4)],
    (Math.random() * 10000 + 5000).toFixed(2),
    (Math.random() * 8000 + 3000).toFixed(2),
    (Math.random() * 2000 + 500).toFixed(2),
    `2026-04-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
  ]);
  return { headers, rows };
};

export function DetailManagement() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>(YEARS[1]);
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<{ headers: string[], rows: string[][] } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setIsDropdownOpen(false);
    setIsModalOpen(true);
    setFile(null);
    setPreviewData(null);
    setSelectedYear(YEARS[1]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      // Mock parsing
      setPreviewData(generateMockPreview(selectedType!));
    }
  };

  const handleConfirm = () => {
    if (!file) {
      alert("请先上传文件");
      return;
    }
    // Mock save
    setIsModalOpen(false);
    setToastMessage("数据上传并保存成功！");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setFile(null);
    setPreviewData(null);
  };

  const needsYearSelect = selectedType === "医保办统计明细表" || selectedType === "医保办统计明细转科表";
  const previewHeaders = previewData?.headers || ['序号', '患者姓名', '住院号', '科室', '总费用', '医保支付', '自费金额', '结算日期'];

  return (
    <div className="h-full flex flex-col relative">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-emerald-50 text-emerald-600 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="flex justify-start mb-6">
        <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm w-full max-w-3xl">
          <h2 className="text-lg font-bold text-gray-900">医保数据导入</h2>
          <div className="relative ml-auto">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md active:scale-95"
            >
              <UploadCloud className="w-4 h-4" />
              选择模板上传
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-10">
                {IMPORT_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">导入数据 - {selectedType}</h3>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {needsYearSelect && (
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-semibold text-gray-700">选择年份<span className="text-rose-500 ml-1">*</span></label>
                    <select 
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="text-sm border border-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2 px-3 bg-white w-48 outline-none"
                    >
                      {YEARS.map(y => <option key={y} value={y}>{y}年</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">上传文件<span className="text-rose-500 ml-1">*</span></label>
                  {!file ? (
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept=".xlsx, .xls, .csv" 
                        onChange={handleFileSelect}
                      />
                      <div className="bg-blue-50 p-3 rounded-full mb-3">
                        <UploadCloud className="w-6 h-6 text-blue-500" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">点击选择本地文件</p>
                      <p className="text-xs text-gray-500 mt-1">支持 .xlsx, .xls, .csv 格式</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 border border-blue-100 bg-blue-50/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileSpreadsheet className="w-8 h-8 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => { setFile(null); setPreviewData(null); }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        重新上传
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700">数据预览</label>
                    <span className="text-xs text-gray-500">仅展示前 10 条数据</span>
                  </div>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-200">
                            {previewHeaders.map((h, i) => (
                              <th key={i} className="py-3 px-4 text-xs font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {previewData ? (
                            previewData.rows.map((row, i) => (
                              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                {row.map((cell, j) => (
                                  <td key={j} className="py-2.5 px-4 text-xs text-gray-600 whitespace-nowrap">{cell}</td>
                                ))}
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={previewHeaders.length} className="py-8 text-center text-sm text-gray-400">
                                暂无数据，请先上传文件
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={handleCancel}
                className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button 
                onClick={handleConfirm}
                disabled={!file}
                className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
