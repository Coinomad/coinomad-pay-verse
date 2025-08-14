import React, { useState } from 'react'
import { XIcon, PlusIcon } from 'lucide-react'
import { PaymentTypeSelector } from './PaymentTypeSelector'
import { SpecificPaymentForm } from './SpecificPaymentForm'
import { RecurringPaymentForm } from './RecurringPaymentForm'
import { ScheduleList } from './ScheduleList'
export type PaymentType = 'specific' | 'recurring'

export type Schedule = {
  id: string
  type: PaymentType
  amount: string
  asset: string
  status: string
  date?: string
  time?: string
  frequency?: string
  day?: string
}

export interface Employee {
  employeeId: string
  name: string
  position: string
  asset?: string
  network?: string
}

interface SchedulingModalProps {
  isOpen: boolean
  onClose: () => void
  employee: Employee
  onRefresh?: () => void // Add this prop
}

export const SchedulingModal: React.FC<SchedulingModalProps> = ({
  isOpen,
  onClose,
  employee,
  onRefresh, // Add this
}) => {
  const [paymentType, setPaymentType] = useState<PaymentType>('recurring')
  const [schedules, setSchedules] = useState<Schedule[]>([])
  
  const handleAddSchedule = (schedule: Omit<Schedule, 'id'>) => {
    const newSchedule = {
      ...schedule,
      id: Math.random().toString(36).substr(2, 9),
    }
    setSchedules([...schedules, newSchedule as Schedule])
    //onAddSchedule(newSchedule as Schedule)
  }
  
  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(schedules.filter(schedule => schedule.id !== scheduleId))
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-black rounded-lg w-full max-w-2xl max-h-[90vh] text-white overflow-hidden flex flex-col">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">
            Payment Schedules - {employee.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon size={20} />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Employee Info */}
          <div className="bg-[#2C2C2C] rounded-lg p-4">
            <div className="mb-2">
              <h3 className="text-lg font-medium">{employee.name}</h3>
              <p className="text-gray-400">{employee.position}</p>
            </div>
            <div className="flex space-x-2">
              <span className="bg-yellow-800 text-yellow-300 px-3 py-1 rounded text-sm">
                USDC
              </span>
              <span className="bg-green-800 text-green-300 px-3 py-1 rounded text-sm">
                BASE
              </span>
            </div>
          </div>
          
          {/* Current Schedules */}
          <div>
            <h3 className="text-lg font-medium mb-2 ">Current Schedules</h3>
            <ScheduleList schedules={schedules} onDeleteSchedule={handleDeleteSchedule} />
          </div>
          
          {/* Add New Schedule */}
          <div>
            <h3 className="text-lg font-medium mb-4">Add New Schedule</h3>
            <PaymentTypeSelector
              selectedType={paymentType}
              onSelectType={setPaymentType}
            />
            <div className="mt-4">
              {paymentType === 'specific' ? (
                <SpecificPaymentForm onAddSchedule={handleAddSchedule} employee={employee} />
              ) : (
                <RecurringPaymentForm onAddSchedule={handleAddSchedule} employee={employee} />
              )}
            </div>
          </div>
        </div>
        
        {/* Footer - Fixed */}
        <div className="p-6 border-t border-gray-700">
          <button
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            onClick={() => {
              onRefresh?.() // Call refresh function if provided
              onClose()
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
