import Link from 'next/link'
import { Scale, Mail, Phone, MapPin } from 'lucide-react'

const navigation = {
  guides: [
    { name: 'Divorce Applications', href: '/guides/divorce' },
    { name: 'Property Settlement', href: '/guides/property' },
    { name: 'Parenting Arrangements', href: '/guides/parenting' },
    { name: 'Child Support', href: '/guides/child-support' },
  ],
  tools: [
    { name: 'Cost Calculator', href: '/tools/cost-calculator' },
    { name: 'Timeline Planner', href: '/tools/timeline' },
    { name: 'Document Checklist', href: '/tools/checklist' },
    { name: 'Court Forms', href: '/tools/forms' },
  ],
  support: [
    { name: 'Legal Aid', href: '/resources/legal-aid' },
    { name: 'Crisis Support', href: '/resources/crisis' },
    { name: 'Community Forums', href: '/community' },
    { name: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { name: 'Terms of Service', href: '/legal/terms' },
    { name: 'Privacy Policy', href: '/legal/privacy' },
    { name: 'Disclaimer', href: '/legal/disclaimer' },
    { name: 'Accessibility', href: '/legal/accessibility' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold text-white">
                Step by Step Family Law
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              Empowering Australians to navigate family law matters with confidence through practical, step-by-step guidance.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Mail className="h-4 w-4" />
                <span>support@stepbystepfamilylaw.com.au</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Phone className="h-4 w-4" />
                <span>1800 FAMILY LAW</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>Australia Wide</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Guides</h3>
            <ul className="mt-4 space-y-2">
              {navigation.guides.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Tools</h3>
            <ul className="mt-4 space-y-2">
              {navigation.tools.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Support</h3>
            <ul className="mt-4 space-y-2">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <div className="flex space-x-6">
              {navigation.legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              © 2024 Step by Step Family Law. All rights reserved.
            </p>
          </div>
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-400">
              This website provides general information only and does not constitute legal advice. 
              Please consult with a qualified legal professional for advice specific to your situation.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}