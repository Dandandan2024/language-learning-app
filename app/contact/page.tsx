import Header from '@/components/Header'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sauna-50 to-orange-50">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Contact{' '}
            <span className="text-sauna-600">Sauna Cult</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with us for questions, bookings, or to learn more about our services.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-sauna-100 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-sauna-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      123 Wellness Street<br />
                      Downtown District<br />
                      City, State 12345
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-sauna-100 p-3 rounded-lg">
                    <Phone className="w-6 h-6 text-sauna-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">(555) 123-SAUN</p>
                    <p className="text-sm text-gray-500">Available 9 AM - 8 PM daily</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-sauna-100 p-3 rounded-lg">
                    <Mail className="w-6 h-6 text-sauna-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">hello@saunacult.com</p>
                    <p className="text-sm text-gray-500">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-sauna-100 p-3 rounded-lg">
                    <Clock className="w-6 h-6 text-sauna-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Hours</h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Monday - Friday: 6:00 AM - 10:00 PM</p>
                      <p>Saturday - Sunday: 8:00 AM - 9:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">What should I bring to my session?</h3>
                  <p className="text-gray-600">
                    Just bring yourself! We provide towels, water, and all necessary amenities. 
                    Wear comfortable, loose-fitting clothing or swimwear.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How long are the sessions?</h3>
                  <p className="text-gray-600">
                    Most sessions are 60 minutes, but we also offer 30-minute and 90-minute options. 
                    Check our booking page for available session lengths.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Can I cancel or reschedule?</h3>
                  <p className="text-gray-600">
                    Yes! You can cancel or reschedule up to 24 hours before your session 
                    through your booking confirmation email.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Is there parking available?</h3>
                  <p className="text-gray-600">
                    Yes, we have free parking available for all customers. 
                    The parking lot is located directly behind our building.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="input-field"
                    placeholder="Your first name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="input-field"
                    placeholder="Your last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="input-field"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="input-field"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <select id="subject" name="subject" className="input-field">
                  <option value="">Select a subject</option>
                  <option value="booking">Booking Question</option>
                  <option value="general">General Inquiry</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="input-field resize-none"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>

              <button type="submit" className="w-full btn-primary">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}