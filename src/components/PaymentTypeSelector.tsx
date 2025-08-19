import React from 'react'
import { PaymentType } from './ScheduleDialog'
interface PaymentTypeSelectorProps {
  selectedType: PaymentType
  onSelectType: (type: PaymentType) => void
}
export const PaymentTypeSelector: React.FC<PaymentTypeSelectorProps> = ({
  selectedType,
  onSelectType,
}) => {
  return (
    <div className="flex bg-[#2C2C2C] rounded-lg p-1 mb-4">
      <button
        className={`flex-1 py-2 rounded-md transition-colors ${selectedType === 'specific' ? 'bg-gray-600' : 'text-gray-400 hover:text-white'}`}
        onClick={() => onSelectType('specific')}
      >
        Specific Date
      </button>
      <button
        className={`flex-1 py-2 rounded-md transition-colors ${selectedType === 'recurring' ? 'bg-gray-600' : 'text-gray-400 hover:text-white'}`}
        onClick={() => onSelectType('recurring')}
      >
        Recurring
      </button>
    </div>
  )
}
