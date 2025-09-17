import Link from 'next/link'
import { ArrowRight, FileText, Calculator, Scale, AlertCircle } from 'lucide-react'

export default function PropertySettlementPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Property Settlement in Family Law
          </h1>
          <p className="text-lg text-gray-600">
            A comprehensive guide to property settlement when separating or divorcing in Australia.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Important Legal Notice</h3>
              <p className="text-sm text-yellow-700 mt-1">
                This guide provides general information only and does not constitute legal advice. 
                Property settlement can be complex and you should consider seeking independent legal advice 
                for your specific circumstances.
              </p>
            </div>
          </div>
        </div>

        {/* Overview */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Property Settlement?</h2>
          <p className="text-gray-600 mb-4">
            Property settlement is the process of dividing assets and liabilities between separating couples. 
            In Australia, this is governed by the Family Law Act 1975 and can be done through:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Informal agreement between the parties</li>
            <li>Binding Financial Agreement (BFA)</li>
            <li>Consent Orders</li>
            <li>Court orders after litigation</li>
          </ul>
        </section>

        {/* Step-by-Step Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Property Settlement Process</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 1: Identify and Value Assets</h3>
              <p className="text-gray-600 mb-3">
                Create a comprehensive list of all assets and liabilities, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Real estate (family home, investment properties)</li>
                <li>Motor vehicles, boats, caravans</li>
                <li>Bank accounts, term deposits, shares</li>
                <li>Superannuation (both parties)</li>
                <li>Personal belongings and furniture</li>
                <li>Business interests and partnerships</li>
                <li>Debts and liabilities</li>
              </ul>
              <Link 
                href="/guides/property-valuation" 
                className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-2"
              >
                Learn more about property valuation <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 2: Consider Contributions</h3>
              <p className="text-gray-600 mb-3">
                Assess both financial and non-financial contributions made by each party:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Initial contributions to the relationship</li>
                <li>Financial contributions during the relationship</li>
                <li>Non-financial contributions (homemaker, parent)</li>
                <li>Contributions to the welfare of the family</li>
                <li>Post-separation contributions</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 3: Assess Future Needs</h3>
              <p className="text-gray-600 mb-3">
                Consider factors that may affect future needs:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Age and health of each party</li>
                <li>Income, property, and financial resources</li>
                <li>Physical and mental capacity for gainful employment</li>
                <li>Care of children under 18</li>
                <li>Commitments to support other people</li>
                <li>Standard of living that is reasonable in the circumstances</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 4: Negotiate Settlement</h3>
              <p className="text-gray-600 mb-3">
                Work towards a fair and equitable division through:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Direct negotiation between parties</li>
                <li>Mediation or family dispute resolution</li>
                <li>Collaborative law processes</li>
                <li>Legal representation and negotiation</li>
              </ul>
            </div>

            <div className="border-l-4 border-red-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 5: Formalise Agreement</h3>
              <p className="text-gray-600 mb-3">
                Once agreement is reached, formalise it through:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Binding Financial Agreement (BFA)</li>
                <li>Consent Orders filed with the court</li>
                <li>Court orders after contested proceedings</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Settlement Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              href="/guides/property-valuation" 
              className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <Calculator className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Valuation</h3>
              <p className="text-gray-600 text-sm">Learn how to value assets and obtain professional valuations.</p>
            </Link>

            <Link 
              href="/guides/consent-orders" 
              className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <FileText className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Consent Orders</h3>
              <p className="text-gray-600 text-sm">Step-by-step guide to filing consent orders for property settlement.</p>
            </Link>

            <Link 
              href="/tools/property-calculator" 
              className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <Scale className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Calculator</h3>
              <p className="text-gray-600 text-sm">Calculate potential property settlement outcomes.</p>
            </Link>
          </div>
        </section>

        {/* Time Limits */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Time Limits</h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Property Settlement Time Limits</h3>
            <ul className="text-red-700 space-y-2">
              <li><strong>Married couples:</strong> Must apply for property settlement within 12 months of divorce becoming final</li>
              <li><strong>De facto couples:</strong> Must apply within 2 years of separation</li>
              <li><strong>Extension of time:</strong> May be possible in exceptional circumstances</li>
            </ul>
            <p className="text-red-600 text-sm mt-3">
              <strong>Important:</strong> These time limits are strict. If you miss them, you may lose your right to property settlement.
            </p>
          </div>
        </section>

        {/* Common Issues */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Property Settlement Issues</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-gray-300 pl-4">
              <h3 className="font-semibold text-gray-900">Hidden Assets</h3>
              <p className="text-gray-600 text-sm">One party may attempt to hide assets or undervalue them.</p>
            </div>
            <div className="border-l-4 border-gray-300 pl-4">
              <h3 className="font-semibold text-gray-900">Business Valuations</h3>
              <p className="text-gray-600 text-sm">Valuing business interests can be complex and may require expert evidence.</p>
            </div>
            <div className="border-l-4 border-gray-300 pl-4">
              <h3 className="font-semibold text-gray-900">Superannuation Splitting</h3>
              <p className="text-gray-600 text-sm">Superannuation can be split but requires specific procedures and forms.</p>
            </div>
            <div className="border-l-4 border-gray-300 pl-4">
              <h3 className="font-semibold text-gray-900">Tax Implications</h3>
              <p className="text-gray-600 text-sm">Property transfers may have capital gains tax implications.</p>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h2>
          <p className="text-gray-600 mb-4">
            Ready to start your property settlement? Follow these steps:
          </p>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>Gather all financial documents and asset information</li>
            <li>Consider obtaining independent legal advice</li>
            <li>Attempt to negotiate directly with your former partner</li>
            <li>If direct negotiation fails, consider mediation</li>
            <li>Formalise any agreement reached</li>
          </ol>
          <div className="mt-6">
            <Link 
              href="/guides/consent-orders" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Start with Consent Orders <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}