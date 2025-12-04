import Link from 'next/link'
import { Heart, Calendar, Target, Users } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-2">
            <Heart className="text-pink-500" size={32} />
            <span className="text-2xl font-bold text-gray-900">Fertara</span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your Fertility Journey,{' '}
            <span className="text-blue-600">Supported Every Step</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Connect with coaches and doctors, track your progress, and manage your fertility care
            all in one comprehensive platform.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium"
            >
              Get Started
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors text-lg font-medium"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard
            icon={<Calendar className="text-blue-600" size={32} />}
            title="Session Management"
            description="Schedule and manage sessions with your coaches and doctors seamlessly"
          />
          <FeatureCard
            icon={<Target className="text-green-600" size={32} />}
            title="Goal Tracking"
            description="Set, monitor, and achieve your fertility goals with expert guidance"
          />
          <FeatureCard
            icon={<Users className="text-purple-600" size={32} />}
            title="Provider Network"
            description="Connect with specialized coaches and medical professionals"
          />
        </div>
      </div>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="bg-gray-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
