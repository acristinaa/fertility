'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, Search, Mail, Phone } from 'lucide-react'
import { format, parseISO } from 'date-fns'

interface Client {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  created_at: string
  active_programs: number
  upcoming_sessions: number
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    try {
      const providerId = 'demo-provider-id'
      const providerType = 'coach' // or 'doctor'

      const linkTable = providerType === 'coach' ? 'client_coach_links' : 'client_doctor_links'
      const linkColumn = providerType === 'coach' ? 'coach_id' : 'doctor_id'

      const { data: links } = await supabase
        .from(linkTable)
        .select('client_id')
        .eq(linkColumn, providerId)
        .eq('status', 'active')

      if (!links || links.length === 0) {
        setClients([])
        setLoading(false)
        return
      }

      const clientIds = links.map((link) => link.client_id)

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, email, phone, created_at')
        .in('id', clientIds)
        .eq('role', 'client')

      const clientsWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { count: programsCount } = await supabase
            .from('programs')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', profile.id)
            .eq('status', 'active')

          const { count: sessionsCount } = await supabase
            .from('sessions')
            .select('*', { count: 'exact', head: true })
            .eq('client_id', profile.id)
            .eq('status', 'scheduled')
            .gte('scheduled_at', new Date().toISOString())

          return {
            ...profile,
            active_programs: programsCount || 0,
            upcoming_sessions: sessionsCount || 0,
          }
        })
      )

      setClients(clientsWithStats)
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase()
    return (
      client.full_name?.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query)
    )
  })

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading clients...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <p className="text-gray-600 mt-2">Manage your client relationships</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Users className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No clients found' : 'No clients yet'}
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? 'Try adjusting your search query'
              : 'Clients will appear here once they connect with you'}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}
    </div>
  )
}

function ClientCard({ client }: { client: Client }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <Users className="text-blue-600" size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {client.full_name || 'Unnamed Client'}
          </h3>
          <p className="text-sm text-gray-500">
            Client since {format(parseISO(client.created_at), 'MMM yyyy')}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {client.email && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Mail size={16} />
            <span className="truncate">{client.email}</span>
          </div>
        )}
        {client.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={16} />
            <span>{client.phone}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-500">Active Programs</p>
          <p className="text-2xl font-bold text-gray-900">{client.active_programs}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Upcoming Sessions</p>
          <p className="text-2xl font-bold text-gray-900">{client.upcoming_sessions}</p>
        </div>
      </div>

      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
        View Profile
      </button>
    </div>
  )
}
