import React, { useState } from 'react'
import { PlusIcon, ClockIcon } from 'lucide-react'
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

interface RecurringPaymentFormProps {
  onAddSchedule: (schedule: Omit<Schedule, 'id'>) => void
  employee?: { 
    employeeId: string
    asset?: string
    network?: string
  }
}

export const RecurringPaymentForm: React.FC<RecurringPaymentFormProps> = ({
  onAddSchedule,
  employee,
}) => {
  const [frequency, setFrequency] = useState('')
  const [day, setDay] = useState('')
  const [selectedHour, setSelectedHour] = useState('12')
  const [selectedMinute, setSelectedMinute] = useState('00')
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
  const [amount, setAmount] = useState('')
  const [asset, setAsset] = useState(employee?.asset || 'USDC')
  const [status, setStatus] = useState('Active')
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
  
  // Get employerId from JWT token
  const getEmployerIdFromToken = (): string | null => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken')
      if (!token) {
        console.error('No access token found')
        return null
      }
      
      const decoded = jwtDecode<JWTPayload>(token)
      return decoded.id
    } catch (error) {
      console.error('Error decoding JWT token:', error)
      return null
    }
  }
  
  // Helper function to format time for display
  const getFormattedTime = () => {
    const hour = selectedHour.padStart(2, '0')
    const minute = selectedMinute.padStart(2, '0')
    return `${hour}:${minute}`
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
  
  const handleSubmit = async () => {
    // Get employerId from JWT token
    const employerId = getEmployerIdFromToken()
    if (!employerId) {
      setError('Unable to get employer information. Please log in again.')
      return
    }
    
    // Validation
    if (!frequency || !amount || (frequency !== 'daily' && !day)) {
      setError('Please fill in all required fields')
      return
    }
    
    if (!employee?.employeeId) {
      setError('Employee information is missing')
      return
    }
    
    if (parseFloat(amount) <= 0) {
      setError('Please enter a valid amount')
      return
    }
    
    setIsSubmitting(true)
    setError('')
    
    try {
      // Convert day to appropriate format for backend
      let dayValue = 0
      let dateValue = 1
      
      if (frequency === 'weekly') {
        // Convert day name to number (0 = Sunday, 1 = Monday, etc.)
        const dayMap = {
          'sunday': 0,
          'monday': 1,
          'tuesday': 2,
          'wednesday': 3,
          'thursday': 4,
          'friday': 5,
          'saturday': 6
        }
        dayValue = dayMap[day.toLowerCase()] ?? 0
      } else if (frequency === 'monthly') {
        dateValue = parseInt(day) || 1
      }
      
      // Prepare the API payload
      const payload = {
        employeeId: employee.employeeId,
        amount: parseFloat(amount),
        asset: asset.toLowerCase(),
        network: (employee.network || 'base').toLowerCase(),
        scheduleType: 'recurring',
        frequency,
        hour: parseInt(selectedHour),
        minute: parseInt(selectedMinute),
        day: dayValue,
        date: dateValue
      }
      
      console.log('=== RECURRING PAYMENT DEBUG ===')
      console.log('User timezone:', selectedTimezone)
      console.log('Local time entered:', getFormattedTime())
      console.log('Frequency:', frequency)
      console.log('Day/Date value:', frequency === 'monthly' ? dateValue : dayValue)
      console.log('Payload:', payload)
      console.log('===============================')
      
      // Call the backend API
      const response = await axiosInstance.post('/wallet/schedule-transaction/', payload)
      
      if (response.data.success) {
        // Add to local schedule list
        onAddSchedule({
          type: 'recurring',
          frequency,
          day: frequency === 'daily' ? 'Every day' : day,
          time: `${getFormattedTime()} (${selectedTimezone})`,
          amount,
          asset,
          status: 'Active',
        })
        
        // Reset form
        setFrequency('')
        setDay('')
        setSelectedHour('12')
        setSelectedMinute('00')
        setAmount('')
        
        console.log('Recurring payment scheduled successfully:', response.data)
      } else {
        setError(response.data.message || 'Failed to schedule recurring payment')
      }
    } catch (error) {
      console.error('Error scheduling recurring payment:', error)
      if (error.response?.data?.message) {
        setError(error.response.data.message)
      } else {
        setError('Failed to schedule recurring payment. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const getDayOptions = () => {
    if (frequency === 'weekly') {
      return [
        { value: 'monday', label: 'Monday' },
        { value: 'tuesday', label: 'Tuesday' },
        { value: 'wednesday', label: 'Wednesday' },
        { value: 'thursday', label: 'Thursday' },
        { value: 'friday', label: 'Friday' },
        { value: 'saturday', label: 'Saturday' },
        { value: 'sunday', label: 'Sunday' },
      ]
    } else if (frequency === 'monthly') {
      return Array.from({ length: 31 }, (_, i) => ({
        value: `${i + 1}`,
        label: `${i + 1}${getDaySuffix(i + 1)}`,
      }))
    }
    return []
  }

  const getDaySuffix = (day: number) => {
    if (day > 3 && day < 21) return 'th'
    switch (day % 10) {
      case 1: return 'st'
      case 2: return 'nd'
      case 3: return 'rd'
      default: return 'th'
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}
      
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
            <option value="" disabled>Select frequency</option>
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
              <option value="" disabled>Select day</option>
              {getDayOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      
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
        <label className="block text-sm text-gray-400 mb-1">Execution Time</label>
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
          
          {/* Time format hint */}
          <div className="text-xs text-gray-500 mt-1">
            Enter time in your local timezone (24-hour format)
          </div>
        </div>
      </div>
      
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
      
      {/* Asset and Network Display */}
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
      
      <button
        onClick={handleSubmit}
        disabled={!frequency || !amount || (frequency !== 'daily' && !day) || isSubmitting}
        className={`w-full py-3 rounded-lg flex items-center justify-center space-x-2 
          ${!frequency || !amount || (frequency !== 'daily' && !day) || isSubmitting
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
            <span>Add Recurring Schedule</span>
          </>
        )}
      </button>
    </div>
  )
}
