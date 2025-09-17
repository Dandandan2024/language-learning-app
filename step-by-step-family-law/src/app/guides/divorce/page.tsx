'use client'

import { useState } from 'react'
import { CheckCircle, Clock, AlertCircle, FileText, Users, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const steps = [
  {
    id: 1,
    title: 'Check Your Eligibility',
    description: 'Determine if you meet the requirements to apply for divorce in Australia',
    content: (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Eligibility Requirements</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              You or your spouse must be an Australian citizen, permanent resident, or ordinarily resident in Australia
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              You must have been separated for at least 12 months
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              Your marriage must be legally recognized in Australia
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              You must have made a genuine attempt to reconcile (if applicable)
            </li>
          </ul>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-900">Important Note</h4>
              <p className="text-sm text-yellow-800 mt-1">
                If you have children under 18, you must also show that proper arrangements have been made for their care.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    completed: false,
  },
  {
    id: 2,
    title: 'Gather Required Documents',
    description: 'Collect all necessary documents and information for your divorce application',
    content: (
      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Required Documents</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Identity Documents</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Birth certificate or passport</li>
                <li>• Driver's license or photo ID</li>
                <li>• Marriage certificate</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Separation Evidence</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Separation date confirmation</li>
                <li>• Living arrangements proof</li>
                <li>• Financial independence evidence</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Document Checklist Tool</h4>
          <p className="text-sm text-blue-800 mb-3">
            Use our interactive checklist to ensure you have all required documents:
          </p>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Open Document Checklist
          </Button>
        </div>
      </div>
    ),
    completed: false,
  },
  {
    id: 3,
    title: 'Complete the Application Form',
    description: 'Fill out the Application for Divorce form with accurate information',
    content: (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">Application Form</h4>
          <p className="text-sm text-green-800 mb-3">
            The Application for Divorce form is available from the Federal Circuit and Family Court of Australia website.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Download Form
            </Button>
            <Button variant="outline" size="sm">
              <Calculator className="h-4 w-4 mr-2" />
              Form Helper Tool
            </Button>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Key Information Required</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Personal Details</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Full names and dates of birth</li>
                <li>• Current addresses</li>
                <li>• Marriage date and location</li>
                <li>• Separation date</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Children Information</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Names and ages of children</li>
                <li>• Living arrangements</li>
                <li>• Financial support details</li>
                <li>• Education and health information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
    completed: false,
  },
  {
    id: 4,
    title: 'File the Application',
    description: 'Submit your completed application to the court',
    content: (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Filing Options</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-blue-700 mb-2">Online Filing</h5>
              <p className="text-sm text-blue-800 mb-2">
                File electronically through the Commonwealth Courts Portal
              </p>
              <Button size="sm" variant="outline">
                File Online
              </Button>
            </div>
            <div>
              <h5 className="font-medium text-blue-700 mb-2">In Person</h5>
              <p className="text-sm text-blue-800 mb-2">
                Visit your local Federal Circuit and Family Court registry
              </p>
              <Button size="sm" variant="outline">
                Find Registry
              </Button>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-900">Filing Fees</h4>
              <p className="text-sm text-yellow-800 mt-1">
                Current filing fee is $990 (as of 2024). Fee reductions may be available for eligible applicants.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    completed: false,
  },
  {
    id: 5,
    title: 'Serve the Application',
    description: 'Serve a copy of the application on your spouse',
    content: (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h4 className="font-semibold text-red-900 mb-2">Service Requirements</h4>
          <p className="text-sm text-red-800 mb-3">
            You must serve a copy of the application on your spouse within 12 months of filing. This is a legal requirement.
          </p>
          <ul className="space-y-2 text-sm text-red-800">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              Service must be by hand or post
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              You cannot serve the documents yourself
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              Proof of service must be filed with the court
            </li>
          </ul>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">Service Methods</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Personal Service</h5>
              <p className="text-sm text-gray-600">
                Have someone else (not you) personally deliver the documents to your spouse.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-gray-700 mb-2">Postal Service</h5>
              <p className="text-sm text-gray-600">
                Send by registered post to your spouse&apos;s last known address.
              </p>
            </div>
          </div>
        </div>
      </div>
    ),
    completed: false,
  },
  {
    id: 6,
    title: 'Attend the Hearing',
    description: 'Attend the divorce hearing (if required)',
    content: (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-2">Hearing Requirements</h4>
          <p className="text-sm text-green-800 mb-3">
            Most divorce applications are dealt with without a hearing. You only need to attend if:
          </p>
          <ul className="space-y-1 text-sm text-green-800">
            <li>• You have children under 18</li>
            <li>• Your spouse has filed a response opposing the divorce</li>
            <li>• The court has specifically requested your attendance</li>
          </ul>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Preparing for the Hearing</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Dress appropriately (business attire)</p>
            <p>• Arrive early and check in at the registry</p>
            <p>• Bring all relevant documents</p>
            <p>• Be prepared to answer questions about your application</p>
          </div>
        </div>
      </div>
    ),
    completed: false,
  },
]

export default function DivorceGuidePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId])
    }
  }

  const currentStepData = steps.find(step => step.id === currentStep)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white">Divorce Applications</h1>
            <p className="mt-4 text-xl text-blue-100">
              Complete step-by-step guide to filing for divorce in Australia
            </p>
            <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-blue-100">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                2-4 hours
              </div>
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                12 steps
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Community support
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Steps Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Steps</h3>
              <nav className="space-y-2">
                {steps.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      currentStep === step.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : completedSteps.includes(step.id)
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Step {step.id}</span>
                      {completedSteps.includes(step.id) && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <div className="text-xs mt-1">{step.title}</div>
                  </button>
                ))}
              </nav>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600 mb-2">Progress</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedSteps.length / steps.length) * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {completedSteps.length} of {steps.length} steps completed
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Step {currentStepData?.id}: {currentStepData?.title}
                    </h2>
                    <p className="text-gray-600 mt-1">{currentStepData?.description}</p>
                  </div>
                  {completedSteps.includes(currentStep) ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => handleStepComplete(currentStep)}
                      size="sm"
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="p-6">
                {currentStepData?.content}
              </div>
              
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    disabled={currentStep === 1}
                  >
                    Previous Step
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
                    disabled={currentStep === steps.length}
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            </div>

            {/* Additional Resources */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-800 mb-4">
                  Get support from our community or connect with legal professionals.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <Users className="h-4 w-4 mr-2" />
                    Ask Community
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Use Tools
                  </Button>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-2">Quick Actions</h3>
                <p className="text-sm text-green-800 mb-4">
                  Access related tools and resources for this step.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Download Forms
                  </Button>
                  <Button variant="outline" size="sm" className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Cost Calculator
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}