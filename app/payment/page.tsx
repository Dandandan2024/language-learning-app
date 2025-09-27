'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

function PaymentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [bookingData, setBookingData] = useState<any>(null)

  const searchParams = useSearchParams()
  const bookingId = searchParams.get('booking')
  const clientSecret = searchParams.get('client_secret')

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails(bookingId)
    }
  }, [bookingId])

  const fetchBookingDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/bookings/${id}`)
      const data = await response.json()
      setBookingData(data)
    } catch (error) {
      toast.error('Failed to load booking details')
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?booking=${bookingId}`,
        },
      })

      if (error) {
        toast.error(error.message || 'Payment failed')
      }
    } catch (error) {
      toast.error('An error occurred during payment')
    } finally {
      setLoading(false)
    }
  }

  if (!bookingData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sauna-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Payment</h2>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">{bookingData.session.title}</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Date:</strong> {new Date(bookingData.session.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> {bookingData.session.startTime} - {bookingData.session.endTime}</p>
            <p><strong>Customer:</strong> {bookingData.user.name}</p>
            <p><strong>Total:</strong> ${bookingData.session.price}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <PaymentElement />
          <button
            type="submit"
            disabled={!stripe || loading}
            className="w-full mt-6 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : `Pay $${bookingData.session.price}`}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const clientSecret = searchParams.get('client_secret')

  if (!clientSecret) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-gray-600">Invalid payment session. Please try booking again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <PaymentForm />
      </Elements>
    </div>
  )
}