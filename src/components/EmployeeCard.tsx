import React from 'react'
import {
  ChevronRightIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from 'lucide-react'
export interface Schedule {
  id: number;
  type: 'daily' | 'weekly' | 'monthly';
  amount: number;
  asset: string;
  status: 'active' | 'paused';
  nextPayment: string;
}

export interface Employee {
  employeeId: string;
  name: string;
  email: string;
  position: string;
  walletAddress: string;
  asset: 'USDT' | 'USDC';
  network: 'BASE' | 'POLYGON' | 'ETHEREUM';
  schedules?: Schedule[];
  scheduleTransaction?: { _id: string; employer: string; employee: string; scheduleType: string; frequency?: string; amount: number; network: string; asset: string; status: string; lastExecuted?: string; nextExecution?: string; executionCount?: number; createdAt: string; updatedAt: string; jobId?: string; } | null;
  initials?: string;
  scheduleStatus?: 'active' | 'not-set';
}
interface EmployeeCardProps {
  employee: Employee
  onClick: () => void
}
export const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  onClick,
}) => {
  // Use employeeId for key if available, fallback to a generated one if needed for mock data
  const employeeId = employee.employeeId || employee.id; // Ensure 'id' is still supported for mock data if it exists

  // Derive initials if not provided
  const initials = employee.initials || employee.name.split(' ').map(n => n[0]).join('').toUpperCase();

  // Derive scheduleStatus if not provided
  const hasActiveSchedule = (employee.schedules && employee.schedules.some(s => s.status === 'active')) ||
                            (employee.scheduleTransaction && employee.scheduleTransaction.status === 'active');
  const scheduleStatus = employee.scheduleStatus || (hasActiveSchedule ? 'active' : 'not-set');

  return (
    <button
      onClick={onClick}
      className="w-full bg-black hover:bg-gray-750 rounded-lg p-4 transition-all duration-200 border border-gray-700 hover:border-gray-600 group"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center text-gray-900 font-semibold text-lg">
            {employee.initials || employee.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </div>

          {/* Employee Info */}
          <div className="text-left">
            <h3 className="text-white font-medium text-lg">{employee.name}</h3>
            <p className="text-gray-400 text-sm">{employee.position}</p>
            <p className="text-gray-500 text-xs font-mono mt-1">
              {employee.walletAddress.slice(0, 6)}...
              {employee.walletAddress.slice(-4)}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Asset: {employee.asset} | Network: {employee.network}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Status Badge */}
          {scheduleStatus === 'active' ? (
            <div className="flex items-center space-x-2 bg-green-900/30 text-green-400 px-3 py-1.5 rounded-full border border-green-800">
              <CheckCircleIcon size={14} />
              <span className="text-xs font-medium">Active Schedule</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-gray-700 text-gray-400 px-3 py-1.5 rounded-full border border-gray-600">
              <AlertCircleIcon size={14} />
              <span className="text-xs font-medium">No Schedule</span>
            </div>
          )}

          {/* Arrow Icon */}
          <ChevronRightIcon
            size={20}
            className="text-gray-500 group-hover:text-yellow-500 transition-colors"
          />
        </div>
      </div>
    </button>
  )
}