
import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { StatsCards } from '@/components/StatsCards';
import { PayrollChart } from '@/components/PayrollChart';
import { EmployeeTable } from '@/components/EmployeeTable';

const Payroll = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Month');

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <Navigation />
      
      <main className="px-6 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Payroll Dashboard</h1>
          <p className="text-[#B3B3B3]">Manage crypto-based compensation for your team</p>
        </div>

        {/* Top Section - Stats and Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="lg:col-span-1">
            <StatsCards />
          </div>
          
          {/* Chart */}
          <div className="lg:col-span-2">
            <PayrollChart 
              selectedPeriod={selectedPeriod} 
              onPeriodChange={setSelectedPeriod} 
            />
          </div>
        </div>

        {/* Employee Table */}
        <EmployeeTable />
      </main>
    </div>
  );
};

export default Payroll;
