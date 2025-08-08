import React, { useState } from 'react'
import {
  CalendarIcon,
  PlusIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { Schedule } from './ScheduleDialog'
interface SpecificPaymentFormProps {
  onAddSchedule: (schedule: Omit<Schedule, 'id'>) => void
}
export const SpecificPaymentForm: React.FC<SpecificPaymentFormProps> = ({
  onAddSchedule,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState('12:00')
  const [amount, setAmount] = useState('')
  const [asset, setAsset] = useState('USDC')
  const [status, setStatus] = useState('Active')
  const [showCalendar, setShowCalendar] = useState(false)
  // Track the currently displayed month/year
  const today = new Date()
  const [displayMonth, setDisplayMonth] = useState(today.getMonth())
  const [displayYear, setDisplayYear] = useState(today.getFullYear())
  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11)
      setDisplayYear(displayYear - 1)
    } else {
      setDisplayMonth(displayMonth - 1)
    }
  }
  // Navigate to next month
  const goToNextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0)
      setDisplayYear(displayYear + 1)
    } else {
      setDisplayMonth(displayMonth + 1)
    }
  }
  // Generate calendar days for the selected month/year
  const generateCalendarDays = () => {
    const firstDay = new Date(displayYear, displayMonth, 1)
    const lastDay = new Date(displayYear, displayMonth + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    let days = []
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(displayYear, displayMonth, i))
    }
    return days
  }
  const handleSubmit = () => {
    if (!selectedDate || !amount) return
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    onAddSchedule({
      type: 'specific',
      amount,
      asset,
      status,
      date: formattedDate,
      time: selectedTime,
    })
    // Reset form
    setSelectedDate(null)
    setSelectedTime('12:00')
    setAmount('')
  }
  const days = generateCalendarDays()
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const currentMonthDisplay = new Date(
    displayYear,
    displayMonth,
  ).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Date</label>
          <div className="relative">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="w-full bg-[#2C2C2C] rounded-lg px-4 py-2 flex items-center justify-between"
            >
              {selectedDate
                ? selectedDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Select date'}
              <CalendarIcon size={18} />
            </button>
            {showCalendar && (
              <div className="absolute top-full left-0 mt-2 bg-[#2C2C2C] p-3 rounded-lg shadow-lg z-10 w-64">
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-1 rounded-full hover:bg-gray-600"
                  >
                    <ChevronLeftIcon size={16} />
                  </button>
                  <div className="text-center font-medium">
                    {currentMonthDisplay}
                  </div>
                  <button
                    onClick={goToNextMonth}
                    className="p-1 rounded-full hover:bg-gray-600"
                  >
                    <ChevronRightIcon size={16} />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekdays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs text-gray-400"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, index) => (
                    <div key={index} className="aspect-square">
                      {day && (
                        <button
                          className={`w-full h-full flex items-center justify-center rounded-full text-sm
                            ${selectedDate && day.getDate() === selectedDate.getDate() && day.getMonth() === selectedDate.getMonth() && day.getFullYear() === selectedDate.getFullYear() ? 'bg-blue-600 text-white' : 'hover:bg-gray-600'}`}
                          onClick={() => {
                            setSelectedDate(day)
                            setShowCalendar(false)
                          }}
                        >
                          {day.getDate()}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Time</label>
          <div className="relative">
            <div className="flex items-center bg-[#2C2C2C] rounded-lg px-4 py-2">
              <ClockIcon size={18} className="mr-2 text-gray-400" />
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
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
        disabled={!selectedDate || !amount}
        className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 
          ${!selectedDate || !amount ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-700 text-white'}`}
      >
        <PlusIcon size={18} />
        <span>Add Schedule</span>
      </button>
    </div>
  )
}
