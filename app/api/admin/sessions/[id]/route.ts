import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { isActive, title, description, date, startTime, endTime, capacity, price } = body

    const updateData: any = {}
    
    if (isActive !== undefined) updateData.isActive = isActive
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (date) updateData.date = new Date(date)
    if (startTime) updateData.startTime = startTime
    if (endTime) updateData.endTime = endTime
    if (capacity !== undefined) updateData.capacity = capacity
    if (price !== undefined) updateData.price = price

    const session = await prisma.session.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json({ session })
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if session has any bookings
    const bookings = await prisma.booking.findMany({
      where: { sessionId: params.id }
    })

    if (bookings.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete session with existing bookings' },
        { status: 400 }
      )
    }

    await prisma.session.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Session deleted successfully' })
  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    )
  }
}