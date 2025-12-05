
import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { QuickActionCard } from '@/components/QuickActionCard';
import { StatsCards } from '@/components/StatsCards';
import { PayrollChart } from '@/components/PayrollChart';
import { EmployeeTable } from '@/components/EmployeeTable';
import { WalletIcon, EmployeeIcon, GenerateIcon } from '@/components/icons';
import { Calendar } from 'lucide-react';

const Payroll = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Month');

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white  px-9 pt-8">
      <Navigation />

      <main className="px-6 py-8 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Payroll Management</h1>
          <p className="text-[#B3B3B3]">Manage crypto-based compensation for your team</p>
        </div>

        {/* Top Section - Stats and Chart */}
        <div className="flex gap-4">
          <QuickActionCard
            title="Quick action"
            description="Perform common payroll tasks efficiently."
            actions={[
              [
                { label: "Run Payroll", icon: WalletIcon },
                { label: "Add Employee", outline: true, icon: EmployeeIcon },
              ],
              [
                { label: "Generate Report", outline: true, icon: GenerateIcon  },
                { label: "View Calendar", outline: true, icon: Calendar },
              ],
            ]}
          />
          <div className="w-full">
            <StatsCards />
          </div>
        </div>

        {/* Chart */}
        <div className="">
          <PayrollChart
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>

        {/* Employee Table */}
        <EmployeeTable />
      </main>
    </div>
  );
};

export default Payroll;
