import Link from 'next/link'
import { Calculator, Calendar, FileText, CheckSquare, DollarSign, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const tools = [
  {
    id: 'cost-calculator',
    title: 'Legal Cost Calculator',
    description: 'Estimate the total cost of your family law matter, including court fees, legal aid, and other expenses.',
    icon: Calculator,
    color: 'bg-blue-100 text-blue-600',
    features: ['Court filing fees', 'Legal aid eligibility', 'Professional costs', 'Hidden expenses'],
    href: '/tools/cost-calculator',
  },
  {
    id: 'timeline-planner',
    title: 'Timeline Planner',
    description: 'Create a personalized timeline for your family law matter with key dates and deadlines.',
    icon: Calendar,
    color: 'bg-green-100 text-green-600',
    features: ['Key milestones', 'Court dates', 'Document deadlines', 'Progress tracking'],
    href: '/tools/timeline',
  },
  {
    id: 'document-checklist',
    title: 'Document Checklist',
    description: 'Interactive checklist to ensure you have all required documents for your case.',
    icon: CheckSquare,
    color: 'bg-purple-100 text-purple-600',
    features: ['Personalized lists', 'Progress tracking', 'Export options', 'Reminder alerts'],
    href: '/tools/checklist',
  },
  {
    id: 'court-forms',
    title: 'Court Forms Generator',
    description: 'Generate and fill out court forms with step-by-step guidance and validation.',
    icon: FileText,
    color: 'bg-orange-100 text-orange-600',
    features: ['Form validation', 'Auto-fill options', 'Print-ready output', 'Save progress'],
    href: '/tools/forms',
  },
  {
    id: 'child-support-calculator',
    title: 'Child Support Calculator',
    description: 'Calculate child support payments based on current Australian guidelines and your situation.',
    icon: DollarSign,
    color: 'bg-red-100 text-red-600',
    features: ['Current rates', 'Income assessment', 'Special circumstances', 'Payment schedules'],
    href: '/tools/child-support-calculator',
  },
  {
    id: 'property-calculator',
    title: 'Property Settlement Calculator',
    description: 'Estimate property division and settlement amounts based on your assets and circumstances.',
    icon: Calculator,
    color: 'bg-indigo-100 text-indigo-600',
    features: ['Asset valuation', 'Superannuation splitting', 'Tax implications', 'Settlement options'],
    href: '/tools/property-calculator',
  },
]

const quickTools = [
  {
    title: 'Emergency Safety Plan',
    description: 'Create a safety plan if you\'re experiencing domestic violence',
    href: '/tools/safety-plan',
    urgent: true,
  },
  {
    title: 'Legal Aid Checker',
    description: 'Check if you\'re eligible for legal aid assistance',
    href: '/tools/legal-aid-checker',
    urgent: false,
  },
  {
    title: 'Court Locator',
    description: 'Find your nearest Federal Circuit and Family Court',
    href: '/tools/court-locator',
    urgent: false,
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Interactive Tools & Calculators
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              Use our comprehensive suite of tools to plan, calculate, and organize your family law matter. 
              All tools are designed specifically for Australian family law.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Tools Section */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Quick Access Tools</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {quickTools.map((tool, index) => (
              <Link
                key={index}
                href={tool.href}
                className={`rounded-lg border-2 p-6 transition-all hover:shadow-md ${
                  tool.urgent 
                    ? 'border-red-200 bg-red-50 hover:border-red-300' 
                    : 'border-gray-200 bg-white hover:border-green-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-lg font-semibold ${tool.urgent ? 'text-red-900' : 'text-gray-900'}`}>
                      {tool.title}
                    </h3>
                    <p className={`mt-2 text-sm ${tool.urgent ? 'text-red-700' : 'text-gray-600'}`}>
                      {tool.description}
                    </p>
                  </div>
                  {tool.urgent && (
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

      {/* Main Tools Section */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">All Tools</h2>
            <p className="mt-4 text-lg text-gray-600">
              Comprehensive tools to help you navigate every aspect of your family law matter
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <div key={tool.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`inline-flex items-center rounded-full p-3 ${tool.color}`}>
                      <tool.icon className="h-6 w-6" />
                    </div>
                    <h3 className="ml-4 text-xl font-semibold text-gray-900">{tool.title}</h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{tool.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {tool.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Link href={tool.href}>
                    <Button className="w-full">
                      Use Tool
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
            <h2 className="text-3xl font-bold text-gray-900">Why Use Our Tools?</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Accurate Calculations</h3>
              <p className="mt-2 text-sm text-gray-600">
                All calculations based on current Australian law and guidelines
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Save Time</h3>
              <p className="mt-2 text-sm text-gray-600">
                Complete complex calculations and planning in minutes, not hours
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Export Results</h3>
              <p className="mt-2 text-sm text-gray-600">
                Download and save your results for future reference and court filing
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                <CheckSquare className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Progress Tracking</h3>
              <p className="mt-2 text-sm text-gray-600">
                Track your progress and stay organized throughout your case
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
            <p className="mt-4 text-lg text-green-100">
              Choose a tool and begin organizing your family law matter today
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                Browse All Tools
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}