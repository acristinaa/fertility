import { Navigation } from '@/components/navigation'

export default function SessionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
