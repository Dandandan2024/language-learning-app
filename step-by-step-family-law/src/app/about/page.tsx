import { Scale, Users, Shield, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const values = [
  {
    name: 'Accessibility',
    description: 'Making family law information accessible to everyone, regardless of their financial situation or legal knowledge.',
    icon: Users,
  },
  {
    name: 'Accuracy',
    description: 'All content is reviewed by qualified legal professionals to ensure accuracy and compliance with current law.',
    icon: Shield,
  },
  {
    name: 'Empowerment',
    description: 'Providing people with the knowledge and tools they need to take control of their family law matters.',
    icon: Scale,
  },
  {
    name: 'Support',
    description: 'Offering comprehensive support through community forums, expert resources, and practical tools.',
    icon: CheckCircle,
  },
]

const team = [
  {
    name: 'Legal Advisory Board',
    description: 'Qualified family law practitioners from across Australia who review all content for accuracy and compliance.',
    role: 'Content Review',
  },
  {
    name: 'Community Moderators',
    description: 'Experienced community members who provide peer support and moderate discussion forums.',
    role: 'Community Support',
  },
  {
    name: 'Content Team',
    description: 'Legal writers and researchers who create clear, practical guides and resources.',
    role: 'Content Creation',
  },
  {
    name: 'Technical Team',
    description: 'Developers and designers who build and maintain the platform and interactive tools.',
    role: 'Platform Development',
  },
]

const stats = [
  { name: 'Guides Available', value: '50+' },
  { name: 'Users Helped', value: '10,000+' },
  { name: 'Success Rate', value: '85%' },
  { name: 'Expert Reviewers', value: '25+' },
  { name: 'Years of Experience', value: '15+' },
  { name: 'States Covered', value: '8' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              About Step by Step Family Law
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              We're on a mission to make family law accessible, understandable, and manageable for every Australian.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                Family law matters are among the most stressful and expensive legal challenges people face. 
                We believe that everyone deserves access to clear, practical guidance to navigate these difficult times.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our platform provides step-by-step guides, interactive tools, and community support to help 
                Australians represent themselves in family law matters with confidence and success.
              </p>
              <div className="flex items-center space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Why We Started</h3>
              <p className="text-gray-600 mb-4">
                After seeing too many people struggle with expensive legal fees and complex court processes, 
                we knew there had to be a better way.
              </p>
              <p className="text-gray-600">
                We created this platform to bridge the gap between expensive legal representation and 
                going it alone without guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="mt-4 text-lg text-gray-600">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-4">
                  <value.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.name}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Impact</h2>
            <p className="mt-4 text-lg text-gray-600">
              Making a difference in the lives of Australian families
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
            <p className="mt-4 text-lg text-gray-600">
              Dedicated professionals working to support you
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{member.description}</p>
                <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-yellow-900 mb-4">Important Legal Disclaimer</h2>
            <div className="prose text-yellow-800">
              <p>
                The information provided on this website is for educational purposes only and does not constitute legal advice. 
                While we strive to provide accurate and up-to-date information, laws and procedures can change, and every 
                situation is unique.
              </p>
              <p>
                We strongly recommend that you consult with a qualified legal professional for advice specific to your 
                circumstances. This website is not a substitute for professional legal representation.
              </p>
              <p>
                By using this website, you acknowledge that you understand these limitations and agree to use the 
                information at your own risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
            <p className="mt-4 text-lg text-blue-100">
              Join thousands of Australians who have successfully navigated family law matters with our guidance.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Your Journey
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}