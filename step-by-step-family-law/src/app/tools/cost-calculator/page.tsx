'use client'

import { useState } from 'react'
import { Calculator, DollarSign, AlertCircle, CheckCircle, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface CostBreakdown {
  courtFees: number
  legalAid: number
  professionalFees: number
  otherExpenses: number
  total: number
}

const courtFees = {
  divorce: 990,
  property: 990,
  parenting: 990,
  childSupport: 990,
  spousalMaintenance: 990,
  domesticViolence: 0,
}

const legalAidThresholds = {
  single: 25000,
  couple: 50000,
  withChildren: 75000,
}

export default function CostCalculatorPage() {
  const [matterType, setMatterType] = useState('')
  const [income, setIncome] = useState('')
  const [partnerIncome, setPartnerIncome] = useState('')
  const [hasChildren, setHasChildren] = useState(false)
  const [needsLawyer, setNeedsLawyer] = useState(false)
  const [lawyerHours, setLawyerHours] = useState('')
  const [hourlyRate, setHourlyRate] = useState('400')
  const [otherExpenses, setOtherExpenses] = useState('')
  const [results, setResults] = useState<CostBreakdown | null>(null)

  const calculateCosts = () => {
    const courtFee = courtFees[matterType as keyof typeof courtFees] || 0
    const totalIncome = parseInt(income) + parseInt(partnerIncome || '0')
    const children = hasChildren ? 1 : 0
    
    // Legal Aid eligibility
    let legalAidEligible = false
    if (children > 0 && totalIncome <= legalAidThresholds.withChildren) {
      legalAidEligible = true
    } else if (totalIncome <= legalAidThresholds.couple) {
      legalAidEligible = true
    } else if (totalIncome <= legalAidThresholds.single) {
      legalAidEligible = true
    }

    const legalAidCost = legalAidEligible ? 0 : 0 // Legal aid is free if eligible
    const professionalFees = needsLawyer ? parseInt(lawyerHours) * parseInt(hourlyRate) : 0
    const other = parseInt(otherExpenses || '0')
    const total = courtFee + legalAidCost + professionalFees + other

    setResults({
      courtFees: courtFee,
      legalAid: legalAidCost,
      professionalFees: professionalFees,
      otherExpenses: other,
      total: total,
    })
  }

  const downloadResults = () => {
    if (!results) return
    
    const content = `Family Law Cost Calculator Results
Generated on: ${new Date().toLocaleDateString()}

Matter Type: ${matterType}
Court Fees: $${results.courtFees}
Legal Aid: $${results.legalAid}
Professional Fees: $${results.professionalFees}
Other Expenses: $${results.otherExpenses}
Total Estimated Cost: $${results.total}

Note: This is an estimate only. Actual costs may vary.
For legal advice, consult a qualified legal professional.`
    
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'family-law-cost-estimate.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-700 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Legal Cost Calculator</h1>
            <p className="mt-4 text-xl text-green-100">
              Estimate the total cost of your family law matter
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Calculate Your Costs</h2>
            
            <form onSubmit={(e) => { e.preventDefault(); calculateCosts(); }} className="space-y-6">
              {/* Matter Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Family Law Matter Type
                </label>
                <select
                  value={matterType}
                  onChange={(e) => setMatterType(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a matter type</option>
                  <option value="divorce">Divorce Application</option>
                  <option value="property">Property Settlement</option>
                  <option value="parenting">Parenting Arrangements</option>
                  <option value="childSupport">Child Support</option>
                  <option value="spousalMaintenance">Spousal Maintenance</option>
                  <option value="domesticViolence">Domestic Violence Order</option>
                </select>
              </div>

              {/* Income Information */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Annual Income (before tax)
                </label>
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter your income"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner's Annual Income (before tax)
                </label>
                <input
                  type="number"
                  value={partnerIncome}
                  onChange={(e) => setPartnerIncome(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter partner's income (optional)"
                />
              </div>

              {/* Children */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hasChildren}
                    onChange={(e) => setHasChildren(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Do you have children under 18?</span>
                </label>
              </div>

              {/* Legal Representation */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={needsLawyer}
                    onChange={(e) => setNeedsLawyer(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Do you plan to hire a lawyer?</span>
                </label>
              </div>

              {needsLawyer && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estimated Lawyer Hours
                    </label>
                    <input
                      type="number"
                      value={lawyerHours}
                      onChange={(e) => setLawyerHours(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Estimated hours"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Hourly rate"
                    />
                  </div>
                </>
              )}

              {/* Other Expenses */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Other Expenses ($)
                </label>
                <input
                  type="number"
                  value={otherExpenses}
                  onChange={(e) => setOtherExpenses(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Other expenses (optional)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Include things like document preparation, photocopying, postage, etc.
                </p>
              </div>

              <Button type="submit" className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Costs
              </Button>
            </form>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Cost Breakdown</h2>
            
            {results ? (
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Court Filing Fees</span>
                    <span className="text-sm font-semibold text-gray-900">${results.courtFees}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Legal Aid</span>
                    <span className="text-sm font-semibold text-gray-900">${results.legalAid}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Professional Fees</span>
                    <span className="text-sm font-semibold text-gray-900">${results.professionalFees}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Other Expenses</span>
                    <span className="text-sm font-semibold text-gray-900">${results.otherExpenses}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-gray-900">Total Estimated Cost</span>
                      <span className="text-lg font-bold text-blue-600">${results.total}</span>
                    </div>
                  </div>
                </div>

                {/* Legal Aid Eligibility */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900">Legal Aid Eligibility</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        {results.legalAid === 0 
                          ? "You may be eligible for free legal aid assistance."
                          : "You may not be eligible for legal aid based on your income."
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cost-Saving Tips */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Cost-Saving Tips</h4>
                  <ul className="space-y-1 text-sm text-green-800">
                    <li>• Consider mediation before going to court</li>
                    <li>• Use our step-by-step guides to reduce lawyer hours</li>
                    <li>• Check if you're eligible for legal aid</li>
                    <li>• Prepare documents yourself using our templates</li>
                  </ul>
                </div>

                <Button onClick={downloadResults} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download Results
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Fill out the form to see your cost breakdown</p>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-900">Important Disclaimer</h4>
              <p className="text-sm text-yellow-800 mt-1">
                This calculator provides estimates only. Actual costs may vary significantly based on the complexity of your case, 
                court requirements, and other factors. This tool does not constitute legal advice. 
                Always consult with a qualified legal professional for advice specific to your situation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}