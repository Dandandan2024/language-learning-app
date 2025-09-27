'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ChartBarIcon, 
  CalendarIcon, 
  UsersIcon, 
  CogIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import AdminLayout from '@/components/AdminLayout'
import DashboardStats from '@/components/DashboardStats'
import SessionsList from '@/components/SessionsList'
import BookingsList from '@/components/BookingsList'
import SessionForm from '@/components/SessionForm'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const response = await fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        localStorage.removeItem('adminToken')
        router.push('/admin/login')
      }
    } catch (error) {
      localStorage.removeItem('adminToken')
      router.push('/admin/login')
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

  if (!isAuthenticated) {
    return null
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
    { id: 'sessions', name: 'Sessions', icon: CalendarIcon },
    { id: 'bookings', name: 'Bookings', icon: UsersIcon },
    { id: 'settings', name: 'Settings', icon: CogIcon },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          {activeTab === 'sessions' && (
            <button
              onClick={() => setActiveTab('create-session')}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-5 h-5" />
              <span>Add Session</span>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-sauna-500 text-sauna-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'dashboard' && <DashboardStats />}
          {activeTab === 'sessions' && <SessionsList />}
          {activeTab === 'create-session' && <SessionForm onSuccess={() => setActiveTab('sessions')} />}
          {activeTab === 'bookings' && <BookingsList />}
          {activeTab === 'settings' && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Settings</h2>
              <p className="text-gray-600">Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}