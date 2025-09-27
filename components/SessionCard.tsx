'use client'

import { Clock, Users, DollarSign, Thermometer } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Session } from '@/types/session'

interface SessionCardProps {
  session: Session
  onBook: () => void
}

export default function SessionCard({ session, onBook }: SessionCardProps) {
  const availableSpots = session.capacity - (session.bookings?.length || 0)
  const isFullyBooked = availableSpots <= 0

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{session.title}</h3>
        <div className="text-2xl font-bold text-sauna-600">
          ${session.price}
        </div>
      </div>

      {session.description && (
        <p className="text-gray-600 mb-4">{session.description}</p>
      )}

      <div className="space-y-3 mb-6">
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-2 text-sauna-600" />
          <span>{session.startTime} - {session.endTime}</span>
        </div>
        
        <div className="flex items-center text-gray-600">
          <Users className="w-4 h-4 mr-2 text-sauna-600" />
          <span>
            {availableSpots} of {session.capacity} spots available
          </span>
        </div>

        <div className="flex items-center text-gray-600">
          <Thermometer className="w-4 h-4 mr-2 text-sauna-600" />
          <span>Optimal temperature maintained</span>
        </div>
      </div>

      <button
        onClick={onBook}
        disabled={isFullyBooked}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isFullyBooked
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'btn-primary hover:bg-sauna-700'
        }`}
      >
        {isFullyBooked ? 'Fully Booked' : 'Book This Session'}
      </button>
    </div>
  )
}