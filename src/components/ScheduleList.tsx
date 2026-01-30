import React from 'react'
import { CalendarIcon, RepeatIcon, Trash2Icon } from 'lucide-react'
import { Schedule } from './ScheduleDialog'

interface ScheduleListProps {
  schedules: Schedule[]
  onDeleteSchedule?: (scheduleId: string) => void
}

export const ScheduleList: React.FC<ScheduleListProps> = ({ schedules, onDeleteSchedule }) => {
  if (schedules.length === 0) {
    return (
      <div className="bg-[#2C2C2C] rounded-lg p-4 text-center text-gray-400">
        No payment schedules set up yet
      </div>
    )
  }
  
  return (
    <div className="space-y-2">
      {schedules.map((schedule) => (
        <div key={schedule.id} className="bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center flex-1">
              {schedule.type === 'specific' ? (
                <CalendarIcon size={18} className="mr-2 text-blue-400" />
              ) : (
                <RepeatIcon size={18} className="mr-2 text-green-400" />
              )}
              <div>
                <div className="font-medium">
                  {schedule.type === 'specific'
                    ? `${schedule.date} at ${schedule.time}`
                    : `${schedule.frequency === 'daily' ? 'Daily' : schedule.frequency === 'weekly' ? 'Weekly' : 'Monthly'} on ${schedule.day} at ${schedule.time}`}
                </div>
                <div className="text-sm text-gray-400">
                  {schedule.amount} {schedule.asset} • {schedule.status}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-yellow-800 text-yellow-300 px-2 py-1 rounded text-xs">
                {schedule.asset}
              </div>
              {onDeleteSchedule && (
                <button
                  onClick={() => onDeleteSchedule(schedule.id)}
                  className="text-gray-400 hover:text-red-400 transition-colors p-4 rounded hover:bg-gray-600"
                  title="Delete schedule"
                >
                  <Trash2Icon size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
