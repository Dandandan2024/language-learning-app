'use client'

import { useState } from 'react'
import { Calculator, Plus, Minus, DollarSign, Home, Car, TrendingUp, AlertCircle } from 'lucide-react'

interface Asset {
  id: string
  name: string
  value: number
  category: 'real-estate' | 'vehicles' | 'financial' | 'other'
}

interface Liability {
  id: string
  name: string
  amount: number
}

export default function PropertyCalculatorPage() {
  const [assets, setAssets] = useState<Asset[]>([
    { id: '1', name: 'Family Home', value: 800000, category: 'real-estate' },
    { id: '2', name: 'Car 1', value: 25000, category: 'vehicles' },
    { id: '3', name: 'Car 2', value: 15000, category: 'vehicles' },
    { id: '4', name: 'Savings Account', value: 50000, category: 'financial' },
    { id: '5', name: 'Superannuation (Party A)', value: 200000, category: 'financial' },
    { id: '6', name: 'Superannuation (Party B)', value: 150000, category: 'financial' }
  ])

  const [liabilities, setLiabilities] = useState<Liability[]>([
    { id: '1', name: 'Home Loan', amount: 400000 },
    { id: '2', name: 'Car Loan', amount: 10000 },
    { id: '3', name: 'Credit Card Debt', amount: 5000 }
  ])

  const [contributions, setContributions] = useState({
    partyA: 60,
    partyB: 40
  })

  const [futureNeeds, setFutureNeeds] = useState({
    partyA: 55,
    partyB: 45
  })

  const addAsset = () => {
    const newAsset: Asset = {
      id: Date.now().toString(),
      name: 'New Asset',
      value: 0,
      category: 'other'
    }
    setAssets([...assets, newAsset])
  }

  const updateAsset = (id: string, field: keyof Asset, value: string | number) => {
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, [field]: value } : asset
    ))
  }

  const removeAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id))
  }

  const addLiability = () => {
    const newLiability: Liability = {
      id: Date.now().toString(),
      name: 'New Liability',
      amount: 0
    }
    setLiabilities([...liabilities, newLiability])
  }

  const updateLiability = (id: string, field: keyof Liability, value: string | number) => {
    setLiabilities(liabilities.map(liability => 
      liability.id === id ? { ...liability, [field]: value } : liability
    ))
  }

  const removeLiability = (id: string) => {
    setLiabilities(liabilities.filter(liability => liability.id !== id))
  }

  const totalAssets = assets.reduce((sum, asset) => sum + asset.value, 0)
  const totalLiabilities = liabilities.reduce((sum, liability) => sum + liability.amount, 0)
  const netProperty = totalAssets - totalLiabilities

  const calculateDivision = () => {
    const contributionWeight = 0.6 // 60% weight to contributions
    const needsWeight = 0.4 // 40% weight to future needs

    const partyAWeight = (contributions.partyA * contributionWeight + futureNeeds.partyA * needsWeight) / 100
    const partyBWeight = (contributions.partyB * contributionWeight + futureNeeds.partyB * needsWeight) / 100

    const partyAEntitlement = netProperty * partyAWeight
    const partyBEntitlement = netProperty * partyBWeight

    return {
      partyA: partyAEntitlement,
      partyB: partyBEntitlement,
      partyAWeight: partyAWeight * 100,
      partyBWeight: partyBWeight * 100
    }
  }

  const division = calculateDivision()

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'real-estate': return <Home className="h-4 w-4" />
      case 'vehicles': return <Car className="h-4 w-4" />
      case 'financial': return <TrendingUp className="h-4 w-4" />
      default: return <DollarSign className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'real-estate': return 'text-blue-600'
      case 'vehicles': return 'text-green-600'
      case 'financial': return 'text-purple-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Property Settlement Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Calculate potential property division outcomes based on contributions and future needs.
          </p>
        </div>

        {/* Important Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">Disclaimer</h3>
              <p className="text-sm text-yellow-700 mt-1">
                This calculator provides estimates only and does not constitute legal advice. 
                Property settlement outcomes depend on many factors and should be discussed with a qualified lawyer.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-8">
            {/* Assets */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Assets</h2>
                <button
                  onClick={addAsset}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Asset
                </button>
              </div>
              
              <div className="space-y-3">
                {assets.map((asset) => (
                  <div key={asset.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded">
                    <div className={`${getCategoryColor(asset.category)}`}>
                      {getCategoryIcon(asset.category)}
                    </div>
                    <input
                      type="text"
                      value={asset.name}
                      onChange={(e) => updateAsset(asset.id, 'name', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      value={asset.value}
                      onChange={(e) => updateAsset(asset.id, 'value', parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <select
                      value={asset.category}
                      onChange={(e) => updateAsset(asset.id, 'category', e.target.value as any)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="real-estate">Real Estate</option>
                      <option value="vehicles">Vehicles</option>
                      <option value="financial">Financial</option>
                      <option value="other">Other</option>
                    </select>
                    <button
                      onClick={() => removeAsset(asset.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Assets:</span>
                  <span>${totalAssets.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Liabilities */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Liabilities</h2>
                <button
                  onClick={addLiability}
                  className="flex items-center px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Liability
                </button>
              </div>
              
              <div className="space-y-3">
                {liabilities.map((liability) => (
                  <div key={liability.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded">
                    <DollarSign className="h-4 w-4 text-red-600" />
                    <input
                      type="text"
                      value={liability.name}
                      onChange={(e) => updateLiability(liability.id, 'name', e.target.value)}
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      value={liability.amount}
                      onChange={(e) => updateLiability(liability.id, 'amount', parseFloat(e.target.value) || 0)}
                      className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                    <button
                      onClick={() => removeLiability(liability.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Liabilities:</span>
                  <span>${totalLiabilities.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Contributions */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contributions Assessment</h2>
              <p className="text-gray-600 text-sm mb-4">
                Assess the relative contributions made by each party (financial and non-financial).
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Party A Contributions: {contributions.partyA}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={contributions.partyA}
                    onChange={(e) => setContributions({
                      ...contributions,
                      partyA: parseInt(e.target.value),
                      partyB: 100 - parseInt(e.target.value)
                    })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Party B Contributions: {contributions.partyB}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={contributions.partyB}
                    onChange={(e) => setContributions({
                      ...contributions,
                      partyB: parseInt(e.target.value),
                      partyA: 100 - parseInt(e.target.value)
                    })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Future Needs */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Future Needs Assessment</h2>
              <p className="text-gray-600 text-sm mb-4">
                Consider factors that may affect future needs and earning capacity.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Party A Future Needs: {futureNeeds.partyA}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={futureNeeds.partyA}
                    onChange={(e) => setFutureNeeds({
                      ...futureNeeds,
                      partyA: parseInt(e.target.value),
                      partyB: 100 - parseInt(e.target.value)
                    })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Party B Future Needs: {futureNeeds.partyB}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={futureNeeds.partyB}
                    onChange={(e) => setFutureNeeds({
                      ...futureNeeds,
                      partyB: parseInt(e.target.value),
                      partyA: 100 - parseInt(e.target.value)
                    })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-8">
            {/* Summary */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Property Pool Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-800">Total Assets:</span>
                  <span className="font-semibold text-blue-900">${totalAssets.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800">Total Liabilities:</span>
                  <span className="font-semibold text-blue-900">${totalLiabilities.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-blue-300 pt-3">
                  <span className="text-blue-900">Net Property Pool:</span>
                  <span className="text-blue-900">${netProperty.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Division Results */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-green-900 mb-4">Proposed Division</h2>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Party A</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entitlement:</span>
                      <span className="font-semibold text-green-900">${division.partyA.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Percentage:</span>
                      <span className="font-semibold text-green-900">{division.partyAWeight.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Party B</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entitlement:</span>
                      <span className="font-semibold text-green-900">${division.partyB.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Percentage:</span>
                      <span className="font-semibold text-green-900">{division.partyBWeight.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calculation Method */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Calculation Method</h2>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Weighting:</strong> 60% contributions, 40% future needs
                </p>
                <p>
                  <strong>Party A Weight:</strong> {(contributions.partyA * 0.6 + futureNeeds.partyA * 0.4).toFixed(1)}%
                </p>
                <p>
                  <strong>Party B Weight:</strong> {(contributions.partyB * 0.6 + futureNeeds.partyB * 0.4).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-500 mt-3">
                  This is a simplified calculation. Actual property settlement considers many additional factors.
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-yellow-900 mb-4">Next Steps</h2>
              <div className="text-sm text-yellow-800 space-y-2">
                <p>1. Review and adjust the calculations based on your specific circumstances</p>
                <p>2. Consider seeking independent legal advice</p>
                <p>3. Attempt to negotiate with the other party</p>
                <p>4. Consider mediation if direct negotiation fails</p>
                <p>5. Formalise any agreement reached</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}