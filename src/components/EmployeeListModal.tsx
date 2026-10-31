import React, { useState, useEffect } from 'react'
import { XIcon, SearchIcon, UsersIcon, Loader2Icon, AlertCircleIcon } from 'lucide-react'
import { EmployeeCard, Employee } from './EmployeeCard'
import axiosInstance from '../Data/axiosInstance'

interface EmployeeListModalProps {
  onClose: () => void
  onSelectEmployee: (employee: Employee) => void
}

export const EmployeeListModal: React.FC<EmployeeListModalProps> = ({
  onClose,
  onSelectEmployee,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get('/employee/getemployees')
        if (response.data && response.data.success) {
          setEmployees(response.data.data || [])
        } else {
          setError(response.data.message || 'Failed to fetch employees')
        }
      } catch (err: any) {
        console.error('Error fetching employees:', err)
        setError(err.response?.data?.message || err.message || 'An error occurred while fetching employees')
      } finally {
        setLoading(false)
      }
    }
    fetchEmployees()
  }, [])

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const activeSchedules = employees.filter(
    (e) => (e.schedules && e.schedules.some(s => s.status === 'active')) || (e.scheduleTransaction && e.scheduleTransaction.status === 'active')
  ).length
  const totalEmployees = employees.length

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
        <div className="bg-black rounded-xl w-full max-w-3xl text-white border border-gray-800 shadow-2xl max-h-[90vh] flex flex-col p-6 items-center justify-center">
          <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
        <div className="bg-gray-900 rounded-xl w-full max-w-3xl text-white border border-gray-800 shadow-2xl max-h-[90vh] flex flex-col p-6 items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
          <button onClick={onClose} className="mt-4 text-yellow-400 hover:underline">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50 p-4">
      <div className="bg-black rounded-xl w-full max-w-3xl text-white border border-gray-800 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                Run Payroll
              </h2>
              <p className="text-gray-400">
                Select an employee to set up or manage their payment schedule
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            >
              <XIcon size={24} />
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-6 mb-4">
            <div className="flex items-center space-x-2">
              <UsersIcon size={18} className="text-gray-400" />
              <span className="text-gray-400 text-sm">
                {totalEmployees} Total Employees
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-400 text-sm">
                {activeSchedules} Active Schedules
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <SearchIcon
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name, role, or wallet address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 transition-all"
            />
          </div>
        </div>

        {/* Employee List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2Icon size={48} className="animate-spin text-yellow-500 mb-3" />
              <p className="text-gray-400">Loading employees...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-red-500">
              <AlertCircleIcon size={48} className="mb-3" />
              <p className="text-lg font-medium">Error: {error}</p>
              <p className="text-gray-400 text-sm mt-1">Please try again later.</p>
            </div>
          ) : filteredEmployees.length > 0 ? (
            filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.employeeId}
                employee={employee}
                onClick={() => onSelectEmployee(employee)}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <UsersIcon size={48} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400">
                No employees found matching your search
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 bg-gray-900/50">
          <button
            onClick={onClose}
            className="w-full bg-gray-800 hover:bg-gray-750 text-white py-3 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}