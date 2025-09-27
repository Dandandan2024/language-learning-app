export interface Session {
  id: string
  title: string
  description?: string
  date: string
  startTime: string
  endTime: string
  capacity: number
  price: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  bookings?: Booking[]
}

export interface Booking {
  id: string
  sessionId: string
  userId: string
  stripePaymentId?: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  notes?: string
  createdAt: string
  updatedAt: string
  session?: Session
  user?: User
}

export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  createdAt: string
  updatedAt: string
  bookings?: Booking[]
}