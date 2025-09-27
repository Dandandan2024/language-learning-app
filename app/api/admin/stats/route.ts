import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Get total sessions
    const totalSessions = await prisma.session.count()

    // Get total bookings
    const totalBookings = await prisma.booking.count()

    // Get total revenue (only confirmed bookings)
    const confirmedBookings = await prisma.booking.findMany({
      where: { status: 'CONFIRMED' },
      include: { session: true }
    })

    const totalRevenue = confirmedBookings.reduce((sum, booking) => {
      return sum + booking.session.price
    }, 0)

    // Get pending bookings
    const pendingBookings = await prisma.booking.count({
      where: { status: 'PENDING' }
    })

    // Get upcoming sessions (next 7 days)
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    const upcomingSessions = await prisma.session.count({
      where: {
        date: {
          gte: today,
          lte: nextWeek
        },
        isActive: true
      }
    })

    return NextResponse.json({
      totalSessions,
      totalBookings,
      totalRevenue,
      pendingBookings,
      upcomingSessions
    })
  } catch (error) {
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}