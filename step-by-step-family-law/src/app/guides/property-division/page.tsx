import Link from 'next/link'
import { ArrowRight, Scale, Calculator, FileText, AlertCircle, Users, DollarSign } from 'lucide-react'

export default function PropertyDivisionPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Property Division in Family Law
          </h1>
          <p className="text-lg text-gray-600">
            Understanding how property is divided fairly and equitably in Australian family law.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Legal Principles</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Property division in Australia is based on the Family Law Act 1975. The court considers 
                contributions and future needs to achieve a just and equitable outcome, not necessarily a 50/50 split.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Framework */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Legal Framework for Property Division</h2>
          
          <div className="bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Section 79 of the Family Law Act 1975</h3>
            <p className="text-blue-800 mb-3">
              The court has power to make orders altering the interests of parties in property, 
              but only if it is just and equitable to do so.
            </p>
            <p className="text-blue-700 text-sm">
              The court must consider the matters set out in section 79(4) of the Act, including 
              contributions and future needs factors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 1: Identify Property Pool</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• All assets owned by either party</li>
                <li>• Assets held jointly or separately</li>
                <li>• Assets acquired before, during, or after relationship</li>
                <li>• Assets in trusts or companies</li>
                <li>• Superannuation interests</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Step 2: Value Property Pool</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• Current market values</li>
                <li>• Professional valuations where required</li>
                <li>• Agreed values where possible</li>
                <li>• Net values after liabilities</li>
                <li>• Superannuation splitting considerations</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Four-Step Process */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Four-Step Property Division Process</h2>
          
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 1: Contributions Assessment</h3>
              <p className="text-gray-600 mb-3">
                Assess both financial and non-financial contributions made by each party:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Financial Contributions</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Initial contributions to relationship</li>
                    <li>• Income earned during relationship</li>
                    <li>• Assets acquired during relationship</li>
                    <li>• Inheritances and gifts</li>
                    <li>• Post-separation contributions</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Non-Financial Contributions</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Homemaker contributions</li>
                    <li>• Parent contributions</li>
                    <li>• Care of family members</li>
                    <li>• Support for partner&apos;s career</li>
                    <li>• Maintenance and improvement of property</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 2: Future Needs Assessment</h3>
              <p className="text-gray-600 mb-3">
                Consider factors that may affect future needs and earning capacity:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Personal Factors</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Age and health of each party</li>
                    <li>• Physical and mental capacity</li>
                    <li>• Income and earning capacity</li>
                    <li>• Property and financial resources</li>
                    <li>• Standard of living</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Family Factors</h4>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li>• Care of children under 18</li>
                    <li>• Commitments to support others</li>
                    <li>• Effect of proposed orders</li>
                    <li>• Any other relevant matters</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 3: Just and Equitable Test</h3>
              <p className="text-gray-600 mb-3">
                Determine if the proposed division is just and equitable in all circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Consider the overall effect of the proposed orders</li>
                <li>Ensure the division reflects the parties&apos; contributions</li>
                <li>Account for future needs appropriately</li>
                <li>Consider any other relevant factors</li>
                <li>Ensure the outcome is fair in all circumstances</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Step 4: Make Orders</h3>
              <p className="text-gray-600 mb-3">
                Make specific orders for the division of property:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1 ml-4">
                <li>Transfer specific assets to each party</li>
                <li>Order sale of assets and division of proceeds</li>
                <li>Make superannuation splitting orders</li>
                <li>Order payment of adjustment amounts</li>
                <li>Address any other necessary matters</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Common Division Scenarios */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Property Division Scenarios</h2>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Scenario 1: Family Home Only</h3>
              <p className="text-gray-600 mb-3">
                When the main asset is the family home:
              </p>
              <ul className="text-gray-600 text-sm space-y-1 ml-4">
                <li>• One party keeps the home, pays out the other</li>
                <li>• Sell the home and divide proceeds</li>
                <li>• Transfer home to one party, other assets to the other</li>
                <li>• Consider children&apos;s needs and stability</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Scenario 2: Business Interests</h3>
              <p className="text-gray-600 mb-3">
                When one or both parties have business interests:
              </p>
              <ul className="text-gray-600 text-sm space-y-1 ml-4">
                <li>• Professional valuation required</li>
                <li>• Consider who will continue the business</li>
                <li>• Account for business debts and liabilities</li>
                <li>• May need to restructure business ownership</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Scenario 3: High-Value Assets</h3>
              <p className="text-gray-600 mb-3">
                When there are significant assets to divide:
              </p>
              <ul className="text-gray-600 text-sm space-y-1 ml-4">
                <li>• Investment properties</li>
                <li>• Shares and managed funds</li>
                <li>• Superannuation splitting</li>
                <li>• Complex financial arrangements</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Superannuation Splitting */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Superannuation Splitting</h2>
          
          <div className="bg-purple-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3">Important Considerations</h3>
            <p className="text-purple-800 mb-3">
              Superannuation can be split between parties, but this requires specific procedures and forms.
            </p>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• Superannuation is treated separately from other property</li>
              <li>• Requires specific superannuation splitting orders</li>
              <li>• May need actuarial certificates for defined benefit funds</li>
              <li>• Different rules apply to different types of superannuation</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Accumulation Funds</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• Easier to split by percentage or dollar amount</li>
                <li>• Can be split immediately or on retirement</li>
                <li>• Consider tax implications</li>
                <li>• May need to establish new superannuation account</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Defined Benefit Funds</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• More complex splitting arrangements</li>
                <li>• May require actuarial certificates</li>
                <li>• Consider future benefit entitlements</li>
                <li>• May need specialist legal advice</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Tax Implications */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tax Implications</h2>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-3">Capital Gains Tax (CGT)</h3>
            <p className="text-red-700 mb-3">
              Property transfers as part of family law settlements may have CGT implications:
            </p>
            <ul className="text-red-600 text-sm space-y-1">
              <li>• Main residence exemption may apply</li>
              <li>• Rollover relief may be available</li>
              <li>• Consider timing of transfers</li>
              <li>• Seek professional tax advice</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Stamp Duty</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• May be exempt for family law transfers</li>
                <li>• Check state-specific exemptions</li>
                <li>• Consider timing of transfers</li>
                <li>• May need court orders for exemption</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Other Tax Considerations</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• Income tax on investment properties</li>
                <li>• Superannuation splitting tax implications</li>
                <li>• Business asset transfers</li>
                <li>• Seek professional tax advice</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Division Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link 
              href="/tools/property-calculator" 
              className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <Calculator className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Calculator</h3>
              <p className="text-gray-600 text-sm">Calculate potential property division outcomes.</p>
            </Link>

            <Link 
              href="/guides/property-settlement" 
              className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <Scale className="h-8 w-8 text-green-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Property Settlement</h3>
              <p className="text-gray-600 text-sm">Complete guide to property settlement process.</p>
            </Link>

            <Link 
              href="/guides/consent-orders" 
              className="block p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <FileText className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Consent Orders</h3>
              <p className="text-gray-600 text-sm">How to formalise property division agreements.</p>
            </Link>
          </div>
        </section>

        {/* Next Steps */}
        <section className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Next Steps</h2>
          <p className="text-gray-600 mb-4">
            Ready to work on property division? Follow these steps:
          </p>
          <ol className="list-decimal list-inside text-gray-600 space-y-2">
            <li>Identify and value all assets and liabilities</li>
            <li>Assess contributions made by each party</li>
            <li>Consider future needs and circumstances</li>
            <li>Attempt to negotiate a fair division</li>
            <li>Consider mediation if direct negotiation fails</li>
            <li>Formalise any agreement reached</li>
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