// import Link from 'next/link'
import { Phone, ExternalLink, Shield, Users, FileText, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const emergencyResources = [
  {
    name: '000 Emergency',
    description: 'Call 000 for immediate police, fire, or ambulance assistance',
    phone: '000',
    urgent: true,
  },
  {
    name: '1800 RESPECT',
    description: 'National sexual assault, domestic and family violence counselling service',
    phone: '1800 737 732',
    urgent: true,
  },
  {
    name: 'Lifeline',
    description: '24/7 crisis support and suicide prevention',
    phone: '13 11 14',
    urgent: true,
  },
  {
    name: 'Kids Helpline',
    description: 'Free, private and confidential counselling for young people',
    phone: '1800 55 1800',
    urgent: false,
  },
]

const legalAidServices = [
  {
    name: 'Legal Aid NSW',
    description: 'Free legal services for eligible people in New South Wales',
    phone: '1300 888 529',
    website: 'https://www.legalaid.nsw.gov.au',
    coverage: 'NSW',
  },
  {
    name: 'Victoria Legal Aid',
    description: 'Free legal help for Victorians who can&apos;t afford a lawyer',
    phone: '1300 792 387',
    website: 'https://www.legalaid.vic.gov.au',
    coverage: 'VIC',
  },
  {
    name: 'Legal Aid Queensland',
    description: 'Free legal services for Queenslanders',
    phone: '1300 65 11 88',
    website: 'https://www.legalaid.qld.gov.au',
    coverage: 'QLD',
  },
  {
    name: 'Legal Aid WA',
    description: 'Free legal services for Western Australians',
    phone: '1300 650 579',
    website: 'https://www.legalaid.wa.gov.au',
    coverage: 'WA',
  },
  {
    name: 'Legal Aid SA',
    description: 'Free legal services for South Australians',
    phone: '1300 366 424',
    website: 'https://www.lsc.sa.gov.au',
    coverage: 'SA',
  },
  {
    name: 'Legal Aid ACT',
    description: 'Free legal services for ACT residents',
    phone: '1300 654 314',
    website: 'https://www.legalaid.act.gov.au',
    coverage: 'ACT',
  },
  {
    name: 'Legal Aid NT',
    description: 'Free legal services for Northern Territory residents',
    phone: '1800 019 343',
    website: 'https://www.legalaid.nt.gov.au',
    coverage: 'NT',
  },
  {
    name: 'Legal Aid TAS',
    description: 'Free legal services for Tasmanians',
    phone: '1300 366 611',
    website: 'https://www.legalaid.tas.gov.au',
    coverage: 'TAS',
  },
]

const communityResources = [
  {
    name: 'Family Relationship Centres',
    description: 'Free family relationship counselling and dispute resolution services',
    phone: '1800 050 321',
    website: 'https://www.familyrelationships.gov.au',
  },
  {
    name: 'Community Legal Centres',
    description: 'Free legal advice and assistance for people who can&apos;t afford a lawyer',
    phone: '1800 677 402',
    website: 'https://www.naclc.org.au',
  },
  {
    name: 'Women&apos;s Legal Services',
    description: 'Specialized legal services for women experiencing family violence',
    phone: '1800 639 784',
    website: 'https://www.wlsa.org.au',
  },
  {
    name: 'Aboriginal Legal Services',
    description: 'Legal services for Aboriginal and Torres Strait Islander people',
    phone: '1800 019 343',
    website: 'https://www.alsnswact.org.au',
  },
]

const courtResources = [
  {
    name: 'Federal Circuit and Family Court of Australia',
    description: 'Official court website with forms, information, and procedures',
    website: 'https://www.fcfcoa.gov.au',
  },
  {
    name: 'Court Forms',
    description: 'Download official court forms and documents',
    website: 'https://www.fcfcoa.gov.au/forms',
  },
  {
    name: 'Court Fees',
    description: 'Current court fees and payment information',
    website: 'https://www.fcfcoa.gov.au/fees',
  },
  {
    name: 'Self-Representation Service',
    description: 'Free assistance for people representing themselves in court',
    phone: '1800 737 732',
    website: 'https://www.fcfcoa.gov.au/self-representation',
  },
]

const supportGroups = [
  {
    name: 'Single Parents Network',
    description: 'Support and resources for single parents',
    website: 'https://www.singleparentsnetwork.com.au',
  },
  {
    name: 'Relationships Australia',
    description: 'Counselling and support for families and relationships',
    phone: '1300 364 277',
    website: 'https://www.relationships.org.au',
  },
  {
    name: 'MensLine Australia',
    description: 'Support for men dealing with relationship and family issues',
    phone: '1300 78 99 78',
    website: 'https://www.mensline.org.au',
  },
  {
    name: 'Parenting Orders Program',
    description: 'Support for parents dealing with parenting orders',
    phone: '1800 880 052',
    website: 'https://www.familyrelationships.gov.au',
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 to-orange-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Resources & Support
            </h1>
            <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600">
              Access emergency support, legal aid services, community resources, and professional help 
              when you need it most.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Resources */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Emergency Resources</h2>
            <p className="mt-4 text-lg text-gray-600">
              If you&apos;re in immediate danger or need urgent help, contact these services right away.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {emergencyResources.map((resource, index) => (
              <div
                key={index}
                className={`rounded-lg border-2 p-6 ${
                  resource.urgent 
                    ? 'border-red-200 bg-red-50 hover:border-red-300' 
                    : 'border-gray-200 bg-white hover:border-blue-300'
                } transition-all hover:shadow-md`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    resource.urgent ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    <Phone className="h-4 w-4 mr-2" />
                    {resource.urgent ? 'Emergency' : 'Support'}
                  </div>
                  {resource.urgent && (
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                
                <h3 className={`text-lg font-semibold mb-2 ${
                  resource.urgent ? 'text-red-900' : 'text-gray-900'
                }`}>
                  {resource.name}
                </h3>
                <p className={`text-sm mb-4 ${
                  resource.urgent ? 'text-red-700' : 'text-gray-600'
                }`}>
                  {resource.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`text-lg font-bold ${
                    resource.urgent ? 'text-red-900' : 'text-blue-900'
                  }`}>
                    {resource.phone}
                  </span>
                  <Button
                    size="sm"
                    className={resource.urgent ? 'bg-red-600 hover:bg-red-700' : ''}
                    onClick={() => window.open(`tel:${resource.phone}`)}
                  >
                    Call Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Aid Services */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Legal Aid Services by State</h2>
            <p className="mt-4 text-lg text-gray-600">
              Free legal services for people who can&apos;t afford a lawyer
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {legalAidServices.map((service, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                    <Shield className="h-4 w-4 mr-2" />
                    Legal Aid
                  </div>
                  <span className="text-xs font-medium text-gray-500">{service.coverage}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-700">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">{service.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />
                    <a 
                      href={service.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Resources */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Community Resources</h2>
            <p className="mt-4 text-lg text-gray-600">
              Additional support services and community organizations
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {communityResources.map((resource, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                    <Users className="h-4 w-4 mr-2" />
                    Community
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-700">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="font-medium">{resource.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-700">
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />
                    <a 
                      href={resource.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Court Resources */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Court Resources</h2>
            <p className="mt-4 text-lg text-gray-600">
              Official court information, forms, and self-representation services
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {courtResources.map((resource, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800">
                    <FileText className="h-4 w-4 mr-2" />
                    Court
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                
                <div className="space-y-2">
                  {resource.phone && (
                    <div className="flex items-center text-sm text-gray-700">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{resource.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-700">
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />
                    <a 
                      href={resource.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Groups */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Support Groups</h2>
            <p className="mt-4 text-lg text-gray-600">
              Connect with others going through similar experiences
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {supportGroups.map((group, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                    <Users className="h-4 w-4 mr-2" />
                    Support Group
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                
                <div className="space-y-2">
                  {group.phone && (
                    <div className="flex items-center text-sm text-gray-700">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="font-medium">{group.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-700">
                    <ExternalLink className="h-4 w-4 mr-2 text-gray-400" />
                    <a 
                      href={group.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Visit Website
                    </a>
                  </div>
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
            <h2 className="text-3xl font-bold text-white">Need More Help?</h2>
            <p className="mt-4 text-lg text-blue-100">
              If you can&apos;t find what you&apos;re looking for, our community and support team are here to help.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                <Users className="h-5 w-5 mr-2" />
                Join Community
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Phone className="h-5 w-5 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}