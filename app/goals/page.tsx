'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Target, Calendar, Plus, TrendingUp } from 'lucide-react'
import { format, parseISO } from 'date-fns'

interface Goal {
  id: number
  title: string
  description: string | null
  status: 'active' | 'achieved' | 'dropped'
  target_date: string | null
  created_at: string
  program_title: string | null
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'achieved' | 'dropped'>('active')

  useEffect(() => {
    fetchGoals()
  }, [filter])

  async function fetchGoals() {
    try {
      const userId = '11111111-1111-1111-1111-111111111008'

      let query = supabase
        .from('goals')
        .select(`
          id,
          title,
          description,
          status,
          target_date,
          created_at,
          program:programs(title)
        `)
        .eq('client_id', userId)
        .order('created_at', { ascending: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data } = await query

      setGoals(
        ((data as Goal[]) || []).map((g) : Goal => ({
          id: g.id,
          title: g.title,
          description: g.description,
          status: g.status,
          target_date: g.target_date,
          created_at: g.created_at,
          program_title: g.program_title,
        })) as Goal[]
      )
    } catch (error) {
      console.error('Error fetching goals:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading goals...</div>
        </div>
      </div>
    )
  }

  const activeGoals = goals.filter((g) => g.status === 'active').length
  const achievedGoals = goals.filter((g) => g.status === 'achieved').length

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Goals</h1>
          <p className="text-gray-600 mt-2">Track your fertility journey milestones</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          New Goal
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-50 p-2 rounded-lg">
              <Target className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Goals</p>
              <p className="text-3xl font-bold text-gray-900">{activeGoals}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-50 p-2 rounded-lg">
              <TrendingUp className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Achieved Goals</p>
              <p className="text-3xl font-bold text-gray-900">{achievedGoals}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <FilterButton active={filter === 'active'} onClick={() => setFilter('active')} label="Active" />
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
        <FilterButton active={filter === 'achieved'} onClick={() => setFilter('achieved')} label="Achieved" />
        <FilterButton active={filter === 'dropped'} onClick={() => setFilter('dropped')} label="Dropped" />
      </div>

      {goals.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Target className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No goals yet</h3>
          <p className="text-gray-600 mb-6">
            Set your first goal to start tracking your fertility journey progress.
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Create Goal
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  )
}

function GoalCard({ goal }: { goal: Goal }) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    achieved: 'bg-blue-100 text-blue-800',
    dropped: 'bg-gray-100 text-gray-800',
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex gap-4 flex-1">
          <div className="bg-green-50 p-3 rounded-lg h-fit">
            <Target className="text-green-600" size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[goal.status]}`}>
                {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
              </span>
            </div>
            {goal.description && (
              <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
            )}
            {goal.program_title && (
              <p className="text-sm text-gray-500 mb-2">
                Part of program: <span className="font-medium">{goal.program_title}</span>
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {goal.target_date && (
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span>Target: {format(parseISO(goal.target_date), 'MMM d, yyyy')}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <span>Created: {format(parseISO(goal.created_at), 'MMM d, yyyy')}</span>
              </div>
            </div>
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
