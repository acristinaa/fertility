'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { FileText, Calendar, User, Plus } from 'lucide-react'
import { format, parseISO } from 'date-fns'

interface Program {
  id: number
  title: string
  description: string | null
  status: 'active' | 'completed' | 'paused' | 'canceled'
  start_date: string | null
  end_date: string | null
  provider_type: string
  provider_name: string | null
  created_at: string
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPrograms()
  }, [])

  async function fetchPrograms() {
    try {
      const userId = '11111111-1111-1111-1111-111111111008'

      const { data } = await supabase
        .from('programs')
        .select(`
          id,
          title,
          description,
          status,
          start_date,
          end_date,
          provider_type,
          created_at,
          provider:profiles!programs_provider_id_fkey(full_name)
        `)
        .eq('client_id', userId)
        .order('created_at', { ascending: false })

      setPrograms(
        ((data as Program[]) || []).map((p) : Program => ({
          ...p,
        })) as Program[]
      )
    } catch (error) {
      console.error('Error fetching programs:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading programs...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Programs</h1>
          <p className="text-gray-600 mt-2">Your personalized fertility programs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          New Program
        </button>
      </div>

      {programs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No programs yet</h3>
          <p className="text-gray-600 mb-6">
            Start your fertility journey by creating your first program with a coach or doctor.
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Create Program
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {programs.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProgramCard({ program }: { program: Program }) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    paused: 'bg-yellow-100 text-yellow-800',
    canceled: 'bg-red-100 text-red-800',
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <div className="bg-purple-50 p-2 rounded-lg h-fit">
            <FileText className="text-purple-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{program.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User size={14} />
              <span>{program.provider_name || 'Provider'} ({program.provider_type})</span>
            </div>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[program.status]}`}>
          {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
        </span>
      </div>

      {program.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{program.description}</p>
      )}

      <div className="flex items-center gap-4 text-sm text-gray-600 border-t border-gray-100 pt-4">
        <div className="flex items-center gap-1">
          <Calendar size={14} />
          <span>
            {program.start_date
              ? format(parseISO(program.start_date), 'MMM d, yyyy')
              : 'Start date not set'}
          </span>
        </div>
        {program.end_date && (
          <div className="flex items-center gap-1">
            <span>→</span>
            <span>{format(parseISO(program.end_date), 'MMM d, yyyy')}</span>
          </div>
        )}
      </div>

      <button className="w-full mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium">
        View Details
      </button>
    </div>
  )
}
