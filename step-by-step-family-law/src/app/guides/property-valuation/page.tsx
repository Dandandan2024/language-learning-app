import Link from 'next/link'
import { ArrowRight, Calculator, Home, Car, TrendingUp, AlertCircle, FileText } from 'lucide-react'

export default function PropertyValuationPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Property Valuation for Family Law
          </h1>
          <p className="text-lg text-gray-600">
            How to properly value assets and obtain professional valuations for property settlement.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Valuation Requirements</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Accurate valuations are crucial for fair property settlement. Some assets may require 
                professional valuations, while others can be self-assessed with proper documentation.
              </p>
            </div>
          </div>
        </div>

        {/* Types of Assets */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Types of Assets to Value</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <Home className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Real Estate</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Family home</li>
                <li>• Investment properties</li>
                <li>• Commercial properties</li>
                <li>• Vacant land</li>
                <li>• Timeshare interests</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <Car className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Vehicles & Equipment</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Motor vehicles</li>
                <li>• Boats and watercraft</li>
                <li>• Caravans and RVs</li>
                <li>• Motorcycles and scooters</li>
                <li>• Farm equipment</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <TrendingUp className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Assets</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Bank accounts</li>
                <li>• Term deposits</li>
                <li>• Shares and investments</li>
                <li>• Cryptocurrency</li>
                <li>• Superannuation</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <FileText className="h-8 w-8 text-orange-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Other Assets</h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Business interests</li>
                <li>• Personal belongings</li>
                <li>• Art and collectibles</li>
                <li>• Jewelry and watches</li>
                <li>• Intellectual property</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Valuation Methods */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Valuation Methods</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Professional Valuations</h3>
              <p className="text-gray-600 mb-3">
                Required for high-value assets and when parties cannot agree on value:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Real estate (usually required for court proceedings)</li>
                <li>Business interests and partnerships</li>
                <li>Complex financial instruments</li>
                <li>Art, antiques, and collectibles over certain value</li>
                <li>Specialized equipment or machinery</li>
              </ul>
              <div className="mt-3 p-3 bg-blue-50 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Cost:</strong> Professional valuations typically cost $500-$2,000+ depending on asset type and complexity.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Market Research</h3>
              <p className="text-gray-600 mb-3">
                Suitable for common assets where market data is readily available:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Motor vehicles (RedBook, CarsGuide)</li>
                <li>Common household items</li>
                <li>Standard furniture and appliances</li>
                <li>Basic jewelry and watches</li>
              </ul>
              <div className="mt-3 p-3 bg-green-50 rounded">
                <p className="text-sm text-green-800">
                  <strong>Documentation:</strong> Keep screenshots and printouts of comparable sales as evidence.
                </p>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Agreed Values</h3>
              <p className="text-gray-600 mb-3">
                When both parties agree on asset values:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Bank account balances (current statements)</li>
                <li>Superannuation balances (recent statements)</li>
                <li>Shares and managed funds (current market value)</li>
                <li>Personal items of sentimental value only</li>
              </ul>
              <div className="mt-3 p-3 bg-purple-50 rounded">
                <p className="text-sm text-purple-800">
                  <strong>Agreement:</strong> Document agreed values in writing to avoid future disputes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Step-by-Step Valuation Process</h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Create Asset Inventory</h3>
                <p className="text-gray-600">List all assets and liabilities with current market values where known.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Identify Valuation Needs</h3>
                <p className="text-gray-600">Determine which assets require professional valuations vs. market research.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Obtain Professional Valuations</h3>
                <p className="text-gray-600">Engage qualified valuers for high-value or complex assets.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Research Market Values</h3>
                <p className="text-gray-600">Use online tools and comparable sales for standard assets.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                5
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Document All Values</h3>
                <p className="text-gray-600">Create a comprehensive schedule with supporting evidence for each valuation.</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4">
                6
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Exchange Information</h3>
                <p className="text-gray-600">Share valuations with the other party and attempt to reach agreement.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Valuers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Finding Professional Valuers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Real Estate Valuers</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• Must be registered with Australian Property Institute (API)</li>
                <li>• Should have experience in family law valuations</li>
                <li>• Look for Certified Practising Valuers (CPV)</li>
                <li>• Check online reviews and references</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Valuers</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• Should be Chartered Accountants or CPAs</li>
                <li>• Specialized in business valuations</li>
                <li>• Experience with family law matters</li>
                <li>• May be accredited with CAANZ or CPA Australia</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Common Valuation Issues */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Valuation Issues</h2>
          
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Disputed Valuations</h3>
              <p className="text-red-700 text-sm">
                When parties cannot agree on values, consider joint valuations or independent expert evidence.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Outdated Valuations</h3>
              <p className="text-yellow-700 text-sm">
                Valuations should be current as of the date of separation or a recent date. Market values can change significantly.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Hidden Assets</h3>
              <p className="text-blue-700 text-sm">
                If you suspect hidden assets, consider forensic accounting or discovery processes.
              </p>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Valuation Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              href="/tools/property-calculator" 
              className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <Calculator className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Calculator</h3>
              <p className="text-gray-600 text-sm">Calculate potential property settlement outcomes based on valuations.</p>
            </Link>

            <Link 
              href="/guides/property-settlement" 
              className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <Home className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Settlement</h3>
              <p className="text-gray-600 text-sm">Complete guide to property settlement process.</p>
            </Link>

            <Link 
              href="/resources" 
              className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <FileText className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Forms & Templates</h3>
              <p className="text-gray-600 text-sm">Asset schedules and valuation templates.</p>
            </Link>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h2>
          <p className="text-gray-600 mb-4">
            Ready to start valuing your assets? Follow these steps:
          </p>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>Create a comprehensive list of all assets and liabilities</li>
            <li>Identify which assets require professional valuations</li>
            <li>Engage qualified valuers for high-value assets</li>
            <li>Research market values for standard assets</li>
            <li>Document all valuations with supporting evidence</li>
            <li>Exchange information with the other party</li>
          </ol>
          <div className="mt-6">
            <Link 
              href="/tools/property-calculator" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Use Property Calculator <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}