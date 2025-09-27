'use client'

import { useState, useEffect } from 'react'
import { format, isAfter, isBefore, addDays, startOfDay } from 'date-fns'
import { CalendarDays, Clock, Users, MapPin, Thermometer } from 'lucide-react'
import Header from '@/components/Header'
import SessionCard from '@/components/SessionCard'
import BookingModal from '@/components/BookingModal'
import { Session } from '@/types/session'

export default function Home() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)

  useEffect(() => {
    fetchSessions()
  }, [selectedDate])

  const fetchSessions = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/sessions?date=${selectedDate.toISOString()}`)
      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAvailableDates = () => {
    const dates = []
    for (let i = 0; i < 30; i++) {
      dates.push(addDays(new Date(), i))
    }
    return dates
  }

  const availableDates = getAvailableDates()

  return (
    <div className="min-h-screen bg-gradient-to-br from-sauna-50 to-orange-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to{' '}
            <span className="text-sauna-600">Sauna Cult</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Experience the ultimate relaxation and wellness with our premium sauna sessions. 
            Book your session in just a few clicks.
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-4">
              <Thermometer className="w-8 h-8 text-sauna-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Premium Heat</h3>
              <p className="text-sm text-gray-600">Optimal temperature control</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Clock className="w-8 h-8 text-sauna-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Flexible Times</h3>
              <p className="text-sm text-gray-600">Multiple sessions daily</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <Users className="w-8 h-8 text-sauna-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Private Sessions</h3>
              <p className="text-sm text-gray-600">Your own space</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <MapPin className="w-8 h-8 text-sauna-600 mb-2" />
              <h3 className="font-semibold text-gray-900">Central Location</h3>
              <p className="text-sm text-gray-600">Easy to find</p>
            </div>
          </div>
        </div>

        {/* Date Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Choose Your Date
          </h2>
          <div className="flex overflow-x-auto gap-2 pb-4">
            {availableDates.map((date) => (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors ${
                  date.toDateString() === selectedDate.toDateString()
                    ? 'bg-sauna-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <div className="text-center">
                  <div className="text-xs opacity-75">
                    {format(date, 'EEE')}
                  </div>
                  <div className="text-sm font-semibold">
                    {format(date, 'd')}
                  </div>
                  <div className="text-xs opacity-75">
                    {format(date, 'MMM')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sessions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Available Sessions for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h2>
          
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sauna-600"></div>
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No sessions available
              </h3>
              <p className="text-gray-500">
                Check back later or try a different date.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  onBook={() => setSelectedSession(session)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Booking Modal */}
      {selectedSession && (
        <BookingModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </div>
  )
}