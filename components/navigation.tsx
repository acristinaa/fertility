'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Calendar, Target, CheckSquare, FileText, Users, LayoutDashboard, UserCircle } from 'lucide-react'

interface NavLinkProps {
  href: string
  icon: React.ReactNode
  label: string
}

function NavLink({ href, icon, label }: NavLinkProps) {
  const pathname = usePathname()
  const isActive = pathname === href || pathname.startsWith(`${href}/`)

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-700 font-medium'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

export function Navigation({ role }: { role: 'client' | 'coach' | 'doctor' | 'admin' }) {
  return (
    <nav className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Fertility Care</h1>
        <p className="text-sm text-gray-500 mt-1 capitalize">{role} Portal</p>
      </div>

      <div className="space-y-2">
        <NavLink href="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
        <NavLink href="/sessions" icon={<Calendar size={20} />} label="Sessions" />

        {(role === 'client' || role === 'coach' || role === 'doctor') && (
          <>
            <NavLink href="/programs" icon={<FileText size={20} />} label="Programs" />
            <NavLink href="/goals" icon={<Target size={20} />} label="Goals" />
            <NavLink href="/action-items" icon={<CheckSquare size={20} />} label="Action Items" />
          </>
        )}

        {(role === 'coach' || role === 'doctor' || role === 'admin') && (
          <NavLink href="/clients" icon={<Users size={20} />} label="Clients" />
        )}

        <div className="pt-6 mt-6 border-t border-gray-200">
          <NavLink href="/profile" icon={<UserCircle size={20} />} label="Profile" />
        </div>
      </div>
    </nav>
  )
}
