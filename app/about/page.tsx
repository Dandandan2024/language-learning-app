import Header from '@/components/Header'
import { Thermometer, Clock, Users, Shield, Heart } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sauna-50 to-orange-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            About{' '}
            <span className="text-sauna-600">Sauna Cult</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're passionate about bringing the ancient tradition of sauna therapy 
            to the modern world, creating a sanctuary for wellness, relaxation, and community.
          </p>
        </div>

        {/* Mission Section */}
        <div className="card mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At Sauna Cult, we believe that regular sauna sessions are essential for 
                maintaining optimal health and well-being. Our mission is to make this 
                ancient wellness practice accessible to everyone in a modern, comfortable environment.
              </p>
              <p className="text-lg text-gray-600">
                We've created a space where you can escape the stresses of daily life, 
                detoxify your body, and reconnect with yourself in a peaceful, nurturing atmosphere.
              </p>
            </div>
            <div className="bg-sauna-100 rounded-xl p-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <Thermometer className="w-12 h-12 text-sauna-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900">Optimal Heat</h3>
                  <p className="text-sm text-gray-600">Perfect temperature control</p>
                </div>
                <div className="text-center">
                  <Clock className="w-12 h-12 text-sauna-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900">Flexible Timing</h3>
                  <p className="text-sm text-gray-600">Sessions throughout the day</p>
                </div>
                <div className="text-center">
                  <Users className="w-12 h-12 text-sauna-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900">Private Sessions</h3>
                  <p className="text-sm text-gray-600">Your own personal space</p>
                </div>
                <div className="text-center">
                  <Shield className="w-12 h-12 text-sauna-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900">Safe & Clean</h3>
                  <p className="text-sm text-gray-600">Highest hygiene standards</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            The Benefits of Regular Sauna Use
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <Heart className="w-16 h-16 text-sauna-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Cardiovascular Health</h3>
              <p className="text-gray-600">
                Regular sauna use can improve circulation, lower blood pressure, 
                and support heart health through heat therapy.
              </p>
            </div>
            
            <div className="card text-center">
              <Thermometer className="w-16 h-16 text-sauna-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Detoxification</h3>
              <p className="text-gray-600">
                Sweating helps eliminate toxins from your body, promoting 
                natural detoxification and improved overall health.
              </p>
            </div>
            
            <div className="card text-center">
              <Users className="w-16 h-16 text-sauna-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Stress Relief</h3>
              <p className="text-gray-600">
                The heat and quiet environment help reduce stress, 
                promote relaxation, and improve mental well-being.
              </p>
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="card">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto mb-8">
              Sauna Cult was born from a simple belief: everyone deserves access to the 
              transformative power of sauna therapy. Founded by wellness enthusiasts who 
              experienced the profound benefits of regular sauna sessions, we set out to 
              create a space that combines traditional sauna wisdom with modern convenience.
            </p>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Today, we're proud to serve our community with state-of-the-art facilities, 
              expert guidance, and a commitment to making wellness accessible to all. 
              Join us in embracing the ancient art of heat therapy for modern well-being.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}