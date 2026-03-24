import React, { useState, useRef } from 'react';
import { Card, CardTitle } from './ui/Card';
import { Table } from './ui/Charts';
import { Badge } from './ui/Badge';
import { UploadCloud, FileSpreadsheet, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

// 初始模拟数据 (每月上传)
const initialHistory = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(2024, 2 - i, 1); // 从2024年3月开始倒推
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(Math.floor(Math.random() * 5) + 1).padStart(2, '0');
  return {
    id: i + 1,
    fileName: `${year}年${month}月DIP结算明细.xlsx`,
    uploader: i % 3 === 0 ? '李医生 (admin)' : '张主任 (admin)',
    uploadTime: `${year}-${month}-${day} 10:23:45`,
    rowCount: Math.floor(Math.random() * 5000) + 8000,
    status: i === 7 ? 'error' : 'success'
  };
});

export function DetailManagement() {
  const [history, setHistory] = useState(initialHistory);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
    // 重置 input，允许重复上传同名文件
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processFile = (file: File) => {
    // 简单校验扩展名
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      alert('请上传 Excel 或 CSV 格式的文件');
      return;
    }

    setIsUploading(true);

    // 模拟上传和解析的延迟
    setTimeout(() => {
      const now = new Date();
      const formatTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      const newRecord = {
        id: Date.now(),
        fileName: file.name,
        uploader: '当前用户 (admin)',
        uploadTime: formatTime,
        rowCount: Math.floor(Math.random() * 5000) + 500, // 模拟解析出的数据行数
        status: 'success'
      };
      
      setHistory([newRecord, ...history]);
      setCurrentPage(1); // 上传成功后回到第一页
      setIsUploading(false);
    }, 1500);
  };

  const totalPages = Math.ceil(history.length / pageSize);
  const paginatedHistory = history.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const tableRows = paginatedHistory.map(record => [
    <div key={`file-${record.id}`} className="flex items-center gap-2">
      <FileSpreadsheet className="w-4 h-4 text-blue-500 shrink-0" />
      <span className="font-medium text-gray-900 truncate max-w-[200px] md:max-w-xs" title={record.fileName}>
        {record.fileName}
      </span>
    </div>,
    record.uploader,
    record.uploadTime,
    record.rowCount.toLocaleString(),
    <Badge key={`status-${record.id}`} isPositive={record.status === 'success'}>
      {record.status === 'success' ? '上传成功' : '处理失败'}
    </Badge>
  ]);

  return (
    <div className="space-y-10">
      <Card>
        <CardTitle>数据上传</CardTitle>
        <div 
          className={`relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer
            ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
            ${isUploading ? 'pointer-events-none opacity-70' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".xlsx, .xls, .csv" 
            onChange={handleFileSelect}
          />
          
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
              <p className="text-sm font-medium text-gray-900">正在上传并解析数据...</p>
              <p className="text-xs text-gray-500 mt-1">请勿关闭当前页面</p>
            </>
          ) : (
            <>
              <div className="bg-blue-50 p-3 rounded-full mb-4 ring-1 ring-blue-100">
                <UploadCloud className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-sm font-medium text-gray-900">点击或拖拽 Excel 文件至此上传</p>
              <p className="text-xs text-gray-500 mt-1">支持 .xlsx, .xls, .csv 格式文件，单文件最大 50MB</p>
            </>
          )}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-gray-500">上传记录</h3>
          <span className="text-xs text-gray-400">共 {history.length} 条记录</span>
        </div>
        <Table 
          headers={['文件名称', '上传人', '上传时间', '数据行数', '状态']}
          rows={tableRows}
        />
        
        {/* 分页控件 */}
        {history.length > 0 && (
          <div className="flex items-center justify-between mt-6 border-t border-gray-100 pt-4">
            <span className="text-sm text-gray-500">
              显示第 {(currentPage - 1) * pageSize + 1} 到 {Math.min(currentPage * pageSize, history.length)} 条，共 {history.length} 条
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-600 font-medium px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
