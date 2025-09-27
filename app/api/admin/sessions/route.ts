import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        bookings: {
          where: {
            status: {
              in: ['PENDING', 'CONFIRMED']
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Error fetching admin sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, date, startTime, endTime, capacity, price, isActive } = body

    // Validate required fields
    if (!title || !date || !startTime || !endTime || !capacity || price === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate capacity
    if (capacity < 1 || capacity > 10) {
      return NextResponse.json(
        { error: 'Capacity must be between 1 and 10' },
        { status: 400 }
      )
    }

    // Validate price
    if (price < 0) {
      return NextResponse.json(
        { error: 'Price must be non-negative' },
        { status: 400 }
      )
    }

    // Validate time
    if (startTime >= endTime) {
      return NextResponse.json(
        { error: 'Start time must be before end time' },
        { status: 400 }
      )
    }

    // Create session
    const session = await prisma.session.create({
      data: {
        title,
        description,
        date: new Date(date),
        startTime,
        endTime,
        capacity,
        price,
        isActive: isActive !== false
      }
    })

    return NextResponse.json({ session }, { status: 201 })
  } catch (error) {
    console.error('Error creating session:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}