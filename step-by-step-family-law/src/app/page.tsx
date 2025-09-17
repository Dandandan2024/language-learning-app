// import Link from 'next/link'
import { ArrowRight, CheckCircle, Users, BookOpen, Calculator, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const features = [
  {
    name: 'Step-by-Step Guides',
    description: 'Comprehensive, easy-to-follow guides for every aspect of family law in Australia.',
    icon: BookOpen,
  },
  {
    name: 'Interactive Tools',
    description: 'Calculators, checklists, and planners to help you organize your case.',
    icon: Calculator,
  },
  {
    name: 'Expert-Reviewed Content',
    description: 'All content reviewed by qualified family law practitioners across Australia.',
    icon: Shield,
  },
  {
    name: 'Community Support',
    description: 'Connect with others going through similar experiences and get peer support.',
    icon: Users,
  },
]

const stats = [
  { name: 'Guides Available', value: '50+' },
  { name: 'Users Helped', value: '10,000+' },
  { name: 'Success Rate', value: '85%' },
  { name: 'Expert Reviewers', value: '25+' },
]

const testimonials = [
  {
    content: 'This website saved me thousands in legal fees. The step-by-step guides made everything so clear.',
    author: 'Sarah M.',
    location: 'Melbourne, VIC',
  },
  {
    content: 'I felt completely lost until I found this resource. The community support was invaluable.',
    author: 'Michael R.',
    location: 'Sydney, NSW',
  },
  {
    content: 'The tools and calculators helped me understand exactly what I needed to do. Highly recommended.',
    author: 'Jennifer L.',
    location: 'Brisbane, QLD',
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Navigate Family Law with
              <span className="text-blue-600"> Confidence</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              Get practical, step-by-step guidance to represent yourself in Australian family law matters. 
              Expert-reviewed content, interactive tools, and community support to help you succeed.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Free Guides
              </Button>
            </div>
            <div className="mt-8 text-sm text-gray-500">
              <p>✓ No legal advice - educational content only</p>
              <p>✓ Always consult a qualified lawyer for your specific situation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="text-center">
                <div className="text-3xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need to Succeed
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Our comprehensive platform provides all the tools and resources you need to navigate family law matters with confidence.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.name}</h3>
                <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Get Started in 3 Simple Steps
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                <span className="text-lg font-bold">1</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Choose Your Situation</h3>
              <p className="mt-2 text-sm text-gray-600">
                Select from our comprehensive list of family law matters to get personalized guidance.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                <span className="text-lg font-bold">2</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Follow Step-by-Step Guides</h3>
              <p className="mt-2 text-sm text-gray-600">
                Work through our detailed guides with interactive tools and real-world examples.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                <span className="text-lg font-bold">3</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Get Support When Needed</h3>
              <p className="mt-2 text-sm text-gray-600">
                Access our community forums and expert resources whenever you need help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              What Our Users Say
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <p className="ml-2 text-sm text-gray-600">Verified User</p>
                </div>
                <blockquote className="mt-4">
                  <p className="text-gray-900">&ldquo;{testimonial.content}&rdquo;</p>
                </blockquote>
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Take Control of Your Family Law Matter?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
              Join thousands of Australians who have successfully navigated family law matters with our guidance.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}