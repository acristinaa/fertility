import { Navigation } from '@/components/navigation'

export default function ClientsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userRole = 'coach' as 'client' | 'coach' | 'doctor' | 'admin'

  return (
    <div className="flex">
      <Navigation role={userRole} />
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  )
}
