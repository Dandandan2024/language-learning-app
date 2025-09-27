'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircleIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function PaymentSuccess() {
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('booking')

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails(bookingId)
    }
  }, [bookingId])

  const fetchBookingDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`)
      const data = await response.json()
      setBooking(data)
      toast.success('Payment successful! Your session is confirmed.')
    } catch (error) {
      toast.error('Failed to load booking details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sauna-600"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600">Please contact support if you need assistance.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sauna-50 to-orange-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="card">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Your sauna session has been confirmed. You'll receive a confirmation email shortly.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <CalendarIcon className="w-5 h-5 text-sauna-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">{booking.session.title}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.session.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <ClockIcon className="w-5 h-5 text-sauna-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Session Time</p>
                  <p className="text-sm text-gray-600">
                    {booking.session.startTime} - {booking.session.endTime}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-sauna-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Status</p>
                  <p className="text-sm text-gray-600 capitalize">{booking.status}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/" className="block btn-primary">
              Book Another Session
            </Link>
            <button 
              onClick={() => window.print()}
              className="block w-full btn-secondary"
            >
              Print Confirmation
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}