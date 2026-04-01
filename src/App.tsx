/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Overview } from './components/Overview';
import { DeptBusiness } from './components/DeptBusiness';
import { DiseaseDistribution } from './components/DiseaseDistribution';
import { CmiAnalysis } from './components/CmiAnalysis';
import { DeviationAnalysis } from './components/DeviationAnalysis';
import { DetailManagement } from './components/DetailManagement';
import { Card, CardTitle } from './components/ui/Card';
import { Database } from 'lucide-react';

export default function App() {
  const [activeMenu, setActiveMenu] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden font-sans">
      <Header activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      <div className="flex-1 flex overflow-hidden">
        {activeMenu !== 'detail-management' && (
          <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        )}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            {activeMenu === 'overview' && <Overview />}
            {activeMenu === 'dept-business' && <DeptBusiness />}
            {activeMenu === 'disease-distribution' && <DiseaseDistribution />}
            {activeMenu === 'cmi-analysis' && <CmiAnalysis />}
            {activeMenu === 'deviation-analysis' && <DeviationAnalysis />}
            {activeMenu === 'detail-management' && <DetailManagement />}
          </div>
        </main>
      </div>
    </div>
  );
}

