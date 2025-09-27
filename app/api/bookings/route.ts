import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, name, email, phone, notes } = body

    // Validate required fields
    if (!sessionId || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if session exists and has capacity
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        bookings: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED']
            }
          }
        }
      }
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    if (!session.isActive) {
      return NextResponse.json(
        { error: 'Session is not available' },
        { status: 400 }
      )
    }

    if (session.bookings.length >= session.capacity) {
      return NextResponse.json(
        { error: 'Session is fully booked' },
        { status: 400 }
      )
    }

    // Create or find user
    let user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      user = await prisma.user.create({
        data: { email, name, phone }
      })
    } else {
      // Update user info if provided
      user = await prisma.user.update({
        where: { id: user.id },
        data: { name, phone }
      })
    }

    // Check if user already has a booking for this session
    const existingBooking = await prisma.booking.findUnique({
      where: {
        sessionId_userId: {
          sessionId,
          userId: user.id
        }
      }
    })

    if (existingBooking) {
      return NextResponse.json(
        { error: 'You already have a booking for this session' },
        { status: 400 }
      )
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        sessionId,
        userId: user.id,
        notes,
        status: 'PENDING'
      }
    })

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(session.price * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bookingId: booking.id,
        sessionId: session.id,
        userId: user.id,
      },
    })

    // Update booking with payment intent ID
    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripePaymentId: paymentIntent.id }
    })

    return NextResponse.json({
      booking,
      clientSecret: paymentIntent.client_secret,
      paymentUrl: `/payment?booking=${booking.id}&client_secret=${paymentIntent.client_secret}`
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}