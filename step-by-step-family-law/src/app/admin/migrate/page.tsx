'use client'

import { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface MigrationStep {
  id: string
  title: string
  description: string
  completed: boolean
  status: 'pending' | 'in-progress' | 'completed' | 'error'
}

const migrationSteps: MigrationStep[] = [
  {
    id: 'export-notion',
    title: 'Export from Notion',
    description: 'Export your Notion content as Markdown files',
    completed: false,
    status: 'pending',
  },
  {
    id: 'upload-content',
    title: 'Upload Content',
    description: 'Upload your exported content to the migration tool',
    completed: false,
    status: 'pending',
  },
  {
    id: 'process-content',
    title: 'Process Content',
    description: 'Convert and structure content for the website',
    completed: false,
    status: 'pending',
  },
  {
    id: 'review-content',
    title: 'Review Content',
    description: 'Review and approve migrated content',
    completed: false,
    status: 'pending',
  },
  {
    id: 'publish-content',
    title: 'Publish Content',
    description: 'Publish content to the live website',
    completed: false,
    status: 'pending',
  },
]

export default function MigrationPage() {
  const [steps, setSteps] = useState<MigrationStep[]>(migrationSteps)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setUploadedFiles(files)
    
    // Update step status
    setSteps(prev => prev.map(step => 
      step.id === 'upload-content' 
        ? { ...step, status: 'completed', completed: true }
        : step
    ))
  }

  const startProcessing = async () => {
    setIsProcessing(true)
    
    // Simulate processing
    setSteps(prev => prev.map(step => 
      step.id === 'process-content' 
        ? { ...step, status: 'in-progress' }
        : step
    ))

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000))

    setSteps(prev => prev.map(step => 
      step.id === 'process-content' 
        ? { ...step, status: 'completed', completed: true }
        : step
    ))

    setIsProcessing(false)
  }

  const downloadMigrationGuide = () => {
    const content = `# Notion to Website Migration Guide

## Step 1: Export from Notion

1. Go to your Notion workspace
2. Navigate to the page you want to export
3. Click the "..." menu in the top right
4. Select "Export" from the dropdown
5. Choose "Markdown" format
6. Click "Export" to download the files

## Step 2: Prepare Your Content

### Content Structure
Organize your content into these categories:
- Getting Started Guides
- Step-by-Step Procedures
- Document Templates
- Interactive Tools
- Support Resources

### File Naming Convention
Use descriptive names for your files:
- divorce-application-guide.md
- property-settlement-steps.md
- child-support-calculator.md
- court-forms-templates.md

### Content Formatting
Ensure your content follows this structure:

\`\`\`markdown
# Guide Title

## Overview
Brief description of what this guide covers

## Prerequisites
What users need before starting

## Step-by-Step Instructions
1. First step
2. Second step
3. etc.

## Important Notes
Any warnings or important information

## Related Resources
Links to other relevant content
\`\`\`

## Step 3: Content Guidelines

### Legal Disclaimers
Every guide must include:
- "This information is for educational purposes only"
- "Not a substitute for legal advice"
- "Consult a qualified legal professional"

### Plain Language
- Use simple, clear language
- Avoid legal jargon
- Include examples and scenarios
- Break down complex processes

### Interactive Elements
Mark interactive content with:
- [CALCULATOR] for tools
- [CHECKLIST] for lists
- [FORM] for documents
- [VIDEO] for tutorials

## Step 4: Quality Checklist

Before uploading, ensure:
- [ ] Content is accurate and up-to-date
- [ ] Legal disclaimers are included
- [ ] Plain language is used throughout
- [ ] Examples are relevant and helpful
- [ ] Links work and are current
- [ ] Content is properly structured

## Step 5: Upload Process

1. Use the migration tool to upload your files
2. Review the processed content
3. Make any necessary adjustments
4. Publish to the live website

## Support

If you need help with migration:
- Email: support@stepbystepfamilylaw.com.au
- Phone: 1800 FAMILY LAW
- Community Forum: /community

Remember: This is a one-time migration process. After this, you'll use the website's content management system for updates.
`

    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'notion-migration-guide.md'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Content Migration Tool</h1>
          <p className="mt-4 text-lg text-gray-600">
            Migrate your Notion content to the website step by step
          </p>
        </div>

        {/* Migration Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Migration Progress</h2>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center space-x-4">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  step.status === 'completed' 
                    ? 'bg-green-100 text-green-600' 
                    : step.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-600'
                    : step.status === 'error'
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {step.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : step.status === 'error' ? (
                    <AlertCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-medium ${
                    step.completed ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
                {step.status === 'in-progress' && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Migration Guide */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <FileText className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900">Migration Guide</h3>
              <p className="text-sm text-blue-800 mt-1 mb-4">
                Download our comprehensive guide to help you prepare and migrate your Notion content.
              </p>
              <Button onClick={downloadMigrationGuide} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Guide
              </Button>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Your Content</h2>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Notion Export Files</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload your exported Markdown files from Notion
            </p>
            
            <input
              type="file"
              multiple
              accept=".md,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </label>
            
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Uploaded files:</p>
                <ul className="text-sm text-gray-500">
                  {uploadedFiles.map((file, index) => (
                    <li key={index}>• {file.name}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Process Content */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Process Content</h2>
            <p className="text-sm text-gray-600 mb-4">
              Click the button below to start processing your uploaded content.
            </p>
            <Button 
              onClick={startProcessing} 
              disabled={isProcessing}
              className="w-full sm:w-auto"
            >
              {isProcessing ? 'Processing...' : 'Start Processing'}
            </Button>
          </div>
        )}

        {/* Content Preview */}
        {steps.find(s => s.id === 'process-content')?.completed && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Content Preview</h2>
            <p className="text-sm text-gray-600 mb-4">
              Review your processed content before publishing.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">
                Content preview will appear here after processing...
              </p>
            </div>
            <div className="mt-4 flex space-x-4">
              <Button>Approve & Publish</Button>
              <Button variant="outline">Edit Content</Button>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-600 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900">Need Help?</h3>
              <p className="text-sm text-yellow-800 mt-1">
                If you encounter any issues during migration, contact our support team:
              </p>
              <ul className="text-sm text-yellow-800 mt-2 space-y-1">
                <li>• Email: support@stepbystepfamilylaw.com.au</li>
                <li>• Phone: 1800 FAMILY LAW</li>
                <li>• Community Forum: /community</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}