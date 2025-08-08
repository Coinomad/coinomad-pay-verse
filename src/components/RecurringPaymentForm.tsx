import React, { useState } from 'react'
import { PlusIcon, ClockIcon } from 'lucide-react'
import { Schedule } from './ScheduleDialog'
interface RecurringPaymentFormProps {
  onAddSchedule: (schedule: Omit<Schedule, 'id'>) => void
}
export const RecurringPaymentForm: React.FC<RecurringPaymentFormProps> = ({
  onAddSchedule,
}) => {
  const [frequency, setFrequency] = useState('')
  const [day, setDay] = useState('')
  const [time, setTime] = useState('12:00')
  const [amount, setAmount] = useState('')
  const [asset, setAsset] = useState('USDC')
  const [status, setStatus] = useState('Active')
  const handleSubmit = () => {
    if (!frequency || !amount || (frequency !== 'daily' && !day)) return
    onAddSchedule({
      type: 'recurring',
      frequency,
      day: frequency === 'daily' ? 'Every day' : day,
      time,
      amount,
      asset,
      status,
    })
    // Reset form
    setFrequency('')
    setDay('')
    setTime('12:00')
    setAmount('')
  }
  const getDayOptions = () => {
    if (frequency === 'weekly') {
      return [
        {
          value: 'monday',
          label: 'Monday',
        },
        {
          value: 'tuesday',
          label: 'Tuesday',
        },
        {
          value: 'wednesday',
          label: 'Wednesday',
        },
        {
          value: 'thursday',
          label: 'Thursday',
        },
        {
          value: 'friday',
          label: 'Friday',
        },
        {
          value: 'saturday',
          label: 'Saturday',
        },
        {
          value: 'sunday',
          label: 'Sunday',
        },
      ]
    } else if (frequency === 'monthly') {
      return Array.from(
        {
          length: 31,
        },
        (_, i) => ({
          value: `${i + 1}`,
          label: `${i + 1}${getDaySuffix(i + 1)}`,
        }),
      )
    }
    return []
  }
  const getDaySuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th'
    switch (day % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  }
  // Generate time options in 15-minute increments
  const generateTimeOptions = () => {
    const options = []
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const formattedHour = hour < 10 ? `0${hour}` : `${hour}`
        const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`
        const timeValue = `${formattedHour}:${formattedMinute}`
        const displayTime = `${formattedHour}:${formattedMinute}`
        options.push({
          value: timeValue,
          display: displayTime,
        })
      }
    }
    return options
  }
  const timeOptions = generateTimeOptions()
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm text-gray-400 mb-1">Frequency</label>
        <div className="relative">
          <select
            value={frequency}
            onChange={(e) => {
              setFrequency(e.target.value)
              setDay('') // Reset day when frequency changes
            }}
            className="w-full bg-[#2C2C2C] rounded-lg px-4 py-2 outline-none appearance-none"
          >
            <option value="" disabled>
              Select frequency
            </option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
      </div>
      {frequency && frequency !== 'daily' && (
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            {frequency === 'weekly' ? 'Day of Week' : 'Day of Month'}
          </label>
          <div className="relative">
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full bg-[#2C2C2C] rounded-lg px-4 py-2 outline-none appearance-none"
            >
              <option value="" disabled>
                Select day
              </option>
              {getDayOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Time</label>
        <div className="relative">
          <div className="flex items-center bg-[#2C2C2C] rounded-lg px-4 py-2">
            <ClockIcon size={18} className="mr-2 text-gray-400" />
            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="bg-transparent flex-1 outline-none appearance-none"
            >
              {timeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.display}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-1">Amount</label>
        <div className="relative">
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[#2C2C2C] rounded-lg px-4 py-2 outline-none"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Asset</label>
          <div className="relative">
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              className="w-full bg-[#2C2C2C] rounded-lg px-4 py-2 outline-none appearance-none"
            >
              <option value="USDC">USDC</option>
              <option value="BASE">BASE</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Status</label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-[#2C2C2C] rounded-lg px-4 py-2 outline-none appearance-none"
            >
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
            </select>
          </div>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        disabled={!frequency || !amount || (frequency !== 'daily' && !day)}
        className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 
          ${!frequency || !amount || (frequency !== 'daily' && !day) ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700 text-white'}`}
      >
        <PlusIcon size={18} />
        <span>Add Schedule</span>
      </button>
    </div>
  )
}
