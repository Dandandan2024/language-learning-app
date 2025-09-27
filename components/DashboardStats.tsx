'use client'

import { useState, useEffect } from 'react'
import { 
  CalendarIcon, 
  UsersIcon, 
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalSessions: number
  totalBookings: number
  totalRevenue: number
  pendingBookings: number
  upcomingSessions: number
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSessions: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0,
    upcomingSessions: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      name: 'Total Sessions',
      value: stats.totalSessions,
      icon: CalendarIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Total Bookings',
      value: stats.totalBookings,
      icon: UsersIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: CurrencyDollarIcon,
      color: 'text-sauna-600',
      bgColor: 'bg-sauna-50'
    },
    {
      name: 'Pending Bookings',
      value: stats.pendingBookings,
      icon: ClockIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {stats.pendingBookings > 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Loading recent bookings...</p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No recent bookings</p>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
          <div className="space-y-3">
            {stats.upcomingSessions > 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">Loading upcoming sessions...</p>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No upcoming sessions</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}