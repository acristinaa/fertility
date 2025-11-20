import { Navigation } from '@/components/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // In a real app, you would get the user's role from auth
  // For now, we'll default to 'client'
  const userRole = 'client' as 'client' | 'coach' | 'doctor' | 'admin'

  return (
    <div className="flex">
      <Navigation role={userRole} />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  )
}
