'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Calendar, Clock, Video, MapPin, Plus, Filter } from 'lucide-react'
import { format, parseISO } from 'date-fns'

interface SessionWithProvider {
  id: number
  scheduled_at: string
  duration_minutes: number
  status: 'scheduled' | 'completed' | 'canceled'
  session_type: string
  mode: string
  provider_type: string
  provider_name: string | null
  client_rating: number | null
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionWithProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'completed' | 'canceled'>('all')

  useEffect(() => {
    fetchSessions()
  }, [filter])

  async function fetchSessions() {
    try {
      const userId = '11111111-1111-1111-1111-111111111008'

      let query = supabase
        .from('sessions')
        .select(`
          id,
          scheduled_at,
          duration_minutes,
          status,
          session_type,
          mode,
          provider_type,
          client_rating,
          provider:profiles!sessions_provider_id_fkey(full_name)
        `)
        .eq('client_id', userId)
        .order('scheduled_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data } = await query

      setSessions(
        ((data as SessionWithProvider[]) || []).map((s) => ({
          id: s.id,
          scheduled_at: s.scheduled_at,
          duration_minutes: s.duration_minutes,
          status: s.status,
          session_type: s.session_type,
          mode: s.mode,
          provider_type: s.provider_type,
          client_rating: s.client_rating,
          provider_name: s.provider_name,
        })) as SessionWithProvider[]
      );
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
          <p className="text-gray-600 mt-2">Manage your coaching and medical appointments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          Schedule Session
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <FilterButton
          active={filter === 'all'}
          onClick={() => setFilter('all')}
          label="All Sessions"
        />
        <FilterButton
          active={filter === 'scheduled'}
          onClick={() => setFilter('scheduled')}
          label="Scheduled"
        />
        <FilterButton
          active={filter === 'completed'}
          onClick={() => setFilter('completed')}
          label="Completed"
        />
        <FilterButton
          active={filter === 'canceled'}
          onClick={() => setFilter('canceled')}
          label="Canceled"
        />
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all'
              ? "You don't have any sessions yet. Schedule your first session to get started."
              : `No ${filter} sessions found.`}
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Schedule a Session
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  )
}

function SessionCard({ session }: { session: SessionWithProvider }) {
  const statusColors = {
    scheduled: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex gap-4 flex-1">
          <div className="bg-blue-50 p-3 rounded-lg h-fit">
            <Calendar className="text-blue-600" size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">
                {session.session_type.charAt(0).toUpperCase() + session.session_type.slice(1)} Session
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[session.status]}`}>
                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
              </span>
            </div>
            <p className="text-gray-600 mb-3">
              with {session.provider_name || 'Provider'} ({session.provider_type})
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{format(parseISO(session.scheduled_at), 'PPP')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span>{format(parseISO(session.scheduled_at), 'p')} ({session.duration_minutes} min)</span>
              </div>
              <div className="flex items-center gap-1">
                {session.mode === 'online' ? (
                  <>
                    <Video size={16} />
                    <span>Online</span>
                  </>
                ) : (
                  <>
                    <MapPin size={16} />
                    <span>In-Person</span>
                  </>
                )}
              </div>
            </div>
            {session.status === 'completed' && session.client_rating && (
              <div className="mt-3 flex items-center gap-1">
                <span className="text-sm text-gray-600">Your rating:</span>
                <span className="text-yellow-500">{'★'.repeat(session.client_rating)}{'☆'.repeat(5 - session.client_rating)}</span>
              </div>
            )}
          </div>
        </div>
        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          View Details
        </button>
      </div>
    </div>
  )
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-600 text-white'
          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  )
}
