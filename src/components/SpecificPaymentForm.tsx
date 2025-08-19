import React, { useState } from 'react'
import {
  CalendarIcon,
  PlusIcon,
  ClockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { Schedule } from './ScheduleDialog'
import axiosInstance from '../Data/axiosInstance'
import { jwtDecode } from 'jwt-decode'

// Add interface for JWT payload
interface JWTPayload {
  email: string
  id: string // This is the employerId
  iat: number
  exp: number
}

interface SpecificPaymentFormProps {
  onAddSchedule: (schedule: Omit<Schedule, 'id'>) => void
  employee?: { 
    employeeId: string
    asset?: string
    network?: string
  }
}

export const SpecificPaymentForm: React.FC<SpecificPaymentFormProps> = ({
  onAddSchedule,
  employee,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedHour, setSelectedHour] = useState('12')
  const [selectedMinute, setSelectedMinute] = useState('00')
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone // Auto-detect user's timezone
  )
  const [amount, setAmount] = useState('')
  const [asset, setAsset] = useState(employee?.asset || 'USDC')
  const [status, setStatus] = useState('Active')
  const [showCalendar, setShowCalendar] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  // Common timezones for the dropdown
  const commonTimezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'London (GMT/BST)' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
    { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
    { value: 'Africa/Lagos', label: 'Lagos (WAT) - Nigeria' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
    { value: 'Asia/Kolkata', label: 'India (IST)' },
    { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  ]
  
  // Helper function to format time for display
  const getFormattedTime = () => {
    const hour = selectedHour.padStart(2, '0')
    const minute = selectedMinute.padStart(2, '0')
    return `${hour}:${minute}`
  }
  
  // Robust timezone conversion using proper Date methods
  const convertLocalTimeToUTC = (localDate: Date, localTime: string, timezone: string) => {
    try {
      const [hours, minutes] = localTime.split(':').map(Number)
      
      // Create a date string in ISO format for the selected timezone
      const year = localDate.getFullYear()
      const month = String(localDate.getMonth() + 1).padStart(2, '0')
      const day = String(localDate.getDate()).padStart(2, '0')
      const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`
      
      // Create the datetime string in the user's timezone
      const localDateTimeStr = `${year}-${month}-${day}T${timeStr}`
      
      // Use a temporary date to get the timezone offset
      const tempDate = new Date(localDateTimeStr)
      
      // Get the offset for the specific timezone at this date/time
      const offsetMinutes = getTimezoneOffsetMinutes(timezone, tempDate)
      
      // Create UTC date by subtracting the timezone offset
      const utcTime = new Date(tempDate.getTime() - (offsetMinutes * 60 * 1000))
      
      return utcTime
    } catch (error) {
      console.error('Error converting timezone:', error)
      throw new Error('Invalid timezone conversion')
    }
  }
  
  // Get timezone offset in minutes for a specific timezone and date
  const getTimezoneOffsetMinutes = (timezone: string, date: Date) => {
    try {
      // Create two dates: one in UTC and one in the target timezone
      const utcDate = new Date(date.toISOString())
      const localDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }))
      
      // Calculate the difference in minutes
      const offsetMs = localDate.getTime() - utcDate.getTime()
      return Math.round(offsetMs / (1000 * 60))
    } catch (error) {
      console.error('Error getting timezone offset:', error)
      return 0
    }
  }
  
  // Get UTC preview of selected time
  const getUTCPreview = () => {
    if (!selectedDate) return ''
    
    try {
      const localTime = getFormattedTime()
      const utcDateTime = convertLocalTimeToUTC(selectedDate, localTime, selectedTimezone)
      
      return utcDateTime.toISOString().substring(11, 16) // Extract HH:MM from ISO string
    } catch (error) {
      return 'Invalid time'
    }
  }
  
  // Get current time in user's timezone for reference
  const getCurrentLocalTime = () => {
    try {
      const now = new Date()
      return now.toLocaleString('en-GB', {
        timeZone: selectedTimezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    } catch (error) {
      return 'Unknown'
    }
  }
  
  // Validation function for time inputs
  const validateTimeInput = (value: string, type: 'hour' | 'minute') => {
    const num = parseInt(value)
    if (isNaN(num)) return false
    
    if (type === 'hour') {
      return num >= 0 && num <= 23
    } else {
      return num >= 0 && num <= 59
    }
  }
  
  // Handle hour input change
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || (validateTimeInput(value, 'hour') && value.length <= 2)) {
      setSelectedHour(value)
    }
  }
  
  // Handle minute input change
  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || (validateTimeInput(value, 'minute') && value.length <= 2)) {
      setSelectedMinute(value)
    }
  }
  
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
  
  // Add function to get employerId from JWT token
  const getEmployerIdFromToken = (): string | null => {
    try {
      // Use consistent token key - try both for backward compatibility
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken')
      if (!token) {
        console.error('No access token found')
        return null
      }
      
      const decoded = jwtDecode<JWTPayload>(token)
      console.log('Decoded JWT:', decoded)
      return decoded.id // This is the employerId
    } catch (error) {
      console.error('Error decoding JWT token:', error)
      return null
    }
  }
  
  const handleSubmit = async () => {
    // Add debugging to see what we're getting
    console.log('Employee data:', employee)
    console.log('Selected date:', selectedDate)
    console.log('Amount:', amount)
    
    // Get employerId from JWT token
    const employerId = getEmployerIdFromToken()
    if (!employerId) {
      setError('Unable to get employer information. Please log in again.')
      return
    }
    
    console.log('Employer ID from token:', employerId)
    
    // Improved validation with more specific error messages
    if (!selectedDate) {
      setError('Please select a date')
      return
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }
    
    if (!employee) {
      setError('Employee data is missing')
      return
    }
    
    if (!employee.employeeId) {
      setError('Employee ID is missing')
      return
    }
    
    // Validate that the scheduled time is in the future
    const localTime = getFormattedTime()
    const scheduledUTC = convertLocalTimeToUTC(selectedDate, localTime, selectedTimezone)
    const now = new Date()
    
    if (scheduledUTC <= now) {
      setError('Scheduled time must be in the future')
      return
    }
    
    setIsSubmitting(true)
    setError('')
    
    try {
      // Convert local time to UTC
      const utcDateTime = convertLocalTimeToUTC(selectedDate, localTime, selectedTimezone)
      
      // Prepare the API payload with UTC time
      const payload = {
        employeeId: employee.employeeId,
        amount: parseFloat(amount),
        asset: asset.toLowerCase(),
        network: (employee.network || 'base').toLowerCase(),
        scheduleType: 'specific',
        scheduledDateTime: utcDateTime.toISOString()
      }
      
      console.log('=== TIMEZONE CONVERSION DEBUG ===')
      console.log('User timezone:', selectedTimezone)
      console.log('Local time entered:', localTime)
      console.log('Local date:', selectedDate.toDateString())
      console.log('Current local time:', getCurrentLocalTime())
      console.log('Converted UTC time:', utcDateTime.toISOString())
      console.log('Payload:', payload)
      console.log('=================================')
      
      // Call the backend API
      const response = await axiosInstance.post('/wallet/schedule-transaction/', payload)
      
      if (response.data.success) {
        // Format date for display
        const formattedDate = selectedDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
        
        // Add to local schedule list with local time for display
        onAddSchedule({
          type: 'specific',
          amount,
          asset,
          status: 'Scheduled',
          date: formattedDate,
          time: `${localTime} (${selectedTimezone})`,
        })
        
        // Reset form
        setSelectedDate(null)
        setSelectedHour('12')
        setSelectedMinute('00')
        setAmount('')
        
        console.log('Transaction scheduled successfully:', response.data)
      } else {
        setError(response.data.message || 'Failed to schedule transaction')
      }
    } catch (error) {
      console.error('Error scheduling transaction:', error)
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Failed to schedule transaction. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
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
  
  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
      
      {/* Date Selection */}
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
        
        {/* Timezone Selection */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Your Timezone</label>
          <div className="relative">
            <select
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
              className="w-full bg-[#2C2C2C] rounded-lg px-4 py-2 outline-none appearance-none"
            >
              {commonTimezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
            <div className="text-xs text-gray-500 mt-1">
              Current time in {selectedTimezone}: {getCurrentLocalTime()}
            </div>
          </div>
        </div>
        
        {/* Time Selection */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Local Time</label>
          <div className="relative">
            <div className="flex items-center bg-[#2C2C2C] rounded-lg px-4 py-2 gap-2">
              <ClockIcon size={18} className="text-gray-400" />
              
              {/* Hour Input */}
              <input
                type="text"
                value={selectedHour}
                onChange={handleHourChange}
                placeholder="HH"
                maxLength={2}
                className="bg-transparent w-8 text-center outline-none"
                onBlur={(e) => {
                  const value = e.target.value
                  if (value && validateTimeInput(value, 'hour')) {
                    setSelectedHour(value.padStart(2, '0'))
                  } else if (!value) {
                    setSelectedHour('00')
                  }
                }}
              />
              
              <span className="text-gray-400">:</span>
              
              {/* Minute Input */}
              <input
                type="text"
                value={selectedMinute}
                onChange={handleMinuteChange}
                placeholder="MM"
                maxLength={2}
                className="bg-transparent w-8 text-center outline-none"
                onBlur={(e) => {
                  const value = e.target.value
                  if (value && validateTimeInput(value, 'minute')) {
                    setSelectedMinute(value.padStart(2, '0'))
                  } else if (!value) {
                    setSelectedMinute('00')
                  }
                }}
              />
              
              {/* Quick Time Buttons */}
              <div className="flex gap-1 ml-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHour('09')
                    setSelectedMinute('00')
                  }}
                  className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                >
                  9AM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHour('12')
                    setSelectedMinute('00')
                  }}
                  className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                >
                  12PM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedHour('17')
                    setSelectedMinute('00')
                  }}
                  className="text-xs px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded transition-colors"
                >
                  5PM
                </button>
              </div>
            </div>
            
            {/* UTC Preview and Validation */}
            {selectedDate && (
              <div className="mt-2 space-y-1">
                <div className="text-xs text-blue-400">
                  ⏰ Will execute at: {getUTCPreview()} UTC
                </div>
                <div className="text-xs text-green-400">
                  ✓ Your local time: {getFormattedTime()} ({selectedTimezone})
                </div>
              </div>
            )}
            
            {/* Time format hint */}
            <div className="text-xs text-gray-500 mt-1">
              Enter time in your local timezone (24-hour format)
            </div>
          </div>
        </div>
      </div>
      
      {/* Amount Input */}
      <div>
        <label className="block text-sm text-gray-400 mb-1">Amount</label>
        <div className="relative">
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-[#2C2C2C] rounded-lg px-4 py-2 outline-none"
          />
        </div>
      </div>
      
      {/* Asset Display */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Asset</label>
          <div className="relative">
            <div className="w-full bg-[#2C2C2C] rounded-lg px-4 py-2 border border-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{employee?.asset || 'USDC'}</span>
                <div className="bg-green-800 text-green-300 px-2 py-1 rounded text-xs">
                  Registered
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Network Display */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Network</label>
          <div className="relative">
            <div className="w-full bg-[#2C2C2C] rounded-lg px-4 py-2 border border-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{employee?.network || 'Base'}</span>
                <div className="bg-blue-800 text-blue-300 px-2 py-1 rounded text-xs">
                  Network
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedDate || !amount || isSubmitting}
        className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 
          ${!selectedDate || !amount || isSubmitting 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-yellow-600 hover:bg-yellow-700 text-white'}`}
      >
        {isSubmitting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Scheduling...</span>
          </>
        ) : (
          <>
            <PlusIcon size={18} />
            <span>Schedule Payment</span>
          </>
        )}
      </button>
    </div>
  )
}