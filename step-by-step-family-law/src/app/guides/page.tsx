import Link from 'next/link'
import { ArrowRight, Clock, Users, FileText, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const guides = [
  {
    id: 'divorce',
    title: 'Divorce Applications',
    description: 'Complete guide to filing for divorce in Australia, including eligibility, grounds, and the step-by-step process.',
    icon: FileText,
    difficulty: 'Beginner',
    duration: '2-4 hours',
    steps: 12,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    id: 'property',
    title: 'Property Settlement',
    description: 'Navigate property division after separation, including asset identification, valuation, and settlement agreements.',
    icon: Calculator,
    difficulty: 'Intermediate',
    duration: '4-6 hours',
    steps: 18,
    color: 'bg-green-100 text-green-600',
  },
  {
    id: 'parenting',
    title: 'Parenting Arrangements',
    description: 'Create parenting plans and arrangements that prioritize your children\'s best interests.',
    icon: Users,
    difficulty: 'Beginner',
    duration: '3-5 hours',
    steps: 15,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    id: 'child-support',
    title: 'Child Support',
    description: 'Understand child support calculations, applications, and enforcement in Australia.',
    icon: Calculator,
    difficulty: 'Beginner',
    duration: '2-3 hours',
    steps: 10,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    id: 'spousal-maintenance',
    title: 'Spousal Maintenance',
    description: 'Learn about spousal maintenance applications, calculations, and enforcement procedures.',
    icon: FileText,
    difficulty: 'Intermediate',
    duration: '3-4 hours',
    steps: 12,
    color: 'bg-red-100 text-red-600',
  },
  {
    id: 'domestic-violence',
    title: 'Domestic Violence Orders',
    description: 'Protect yourself and your children with domestic violence orders and safety planning.',
    icon: Users,
    difficulty: 'Beginner',
    duration: '1-2 hours',
    steps: 8,
    color: 'bg-pink-100 text-pink-600',
  },
]

const quickStart = [
  {
    title: 'Emergency Planning',
    description: 'If you\'re in immediate danger, get help now.',
    href: '/guides/emergency',
    urgent: true,
  },
  {
    title: 'Am I Ready to Self-Represent?',
    description: 'Take our assessment to determine if self-representation is right for you.',
    href: '/guides/assessment',
    urgent: false,
  },
  {
    title: 'Understanding the Court System',
    description: 'Learn about the Federal Circuit and Family Court of Australia.',
    href: '/guides/court-system',
    urgent: false,
  },
]

export default function GuidesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Step-by-Step Family Law Guides
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              Comprehensive, expert-reviewed guides to help you navigate every aspect of family law in Australia. 
              Each guide includes practical tools, real-world examples, and community support.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Start Section */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Start</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {quickStart.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`rounded-lg border-2 p-6 transition-all hover:shadow-md ${
                  item.urgent 
                    ? 'border-red-200 bg-red-50 hover:border-red-300' 
                    : 'border-gray-200 bg-white hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold ${item.urgent ? 'text-red-900' : 'text-gray-900'}`}>
                      {item.title}
                    </h3>
                    <p className={`mt-2 text-sm ${item.urgent ? 'text-red-700' : 'text-gray-600'}`}>
                      {item.description}
                    </p>
                  </div>
                  {item.urgent && (
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                      Urgent
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Guides Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Guide</h2>
            <p className="mt-4 text-lg text-gray-600">
              Select the family law matter that applies to your situation
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <div key={guide.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${guide.color}`}>
                      <guide.icon className="h-4 w-4 mr-2" />
                      {guide.difficulty}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {guide.duration}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-gray-600 mb-4">{guide.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">{guide.steps} steps</span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      Community support
                    </div>
                  </div>
                  
                  <Link href={`/guides/${guide.id}`}>
                    <Button className="w-full">
                      Start Guide
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Makes Our Guides Different</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Expert Reviewed</h3>
              <p className="mt-2 text-sm text-gray-600">
                All content reviewed by qualified family law practitioners
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Calculator className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Interactive Tools</h3>
              <p className="mt-2 text-sm text-gray-600">
                Calculators, checklists, and planners built into each guide
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Community Support</h3>
              <p className="mt-2 text-sm text-gray-600">
                Connect with others going through similar experiences
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Regular Updates</h3>
              <p className="mt-2 text-sm text-gray-600">
                Content updated regularly to reflect current law and procedures
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
              Choose your guide and begin your journey to successful self-representation
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Browse All Guides
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}