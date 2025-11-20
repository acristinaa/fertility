'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckSquare, Calendar, Plus, AlertCircle } from 'lucide-react'
import { format, parseISO, isPast } from 'date-fns'

interface ActionItem {
  id: number
  title: string
  description: string | null
  status: 'open' | 'in_progress' | 'done' | 'canceled'
  due_date: string | null
  created_at: string
  goal_title: string | null
  session_id: number | null
}

export default function ActionItemsPage() {
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'done' | 'canceled'>('open')

  useEffect(() => {
    fetchActionItems()
  }, [filter])

  async function fetchActionItems() {
    try {
      const userId = 'demo-user-id'

      let query = supabase
        .from('action_items')
        .select(`
          id,
          title,
          description,
          status,
          due_date,
          created_at,
          session_id,
          goal:goals(title)
        `)
        .eq('client_id', userId)
        .order('due_date', { ascending: true, nullsFirst: false })

      if (filter !== 'all') {
        query = query.eq('status', filter)
      }

      const { data } = await query

      setActionItems(
        (data || []).map((a: any) => ({
          ...a,
          goal_title: a.goal?.title || null,
        }))
      )
    } catch (error) {
      console.error('Error fetching action items:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading action items...</div>
        </div>
      </div>
    )
  }

  const pendingCount = actionItems.filter((a) => a.status === 'open' || a.status === 'in_progress').length
  const overdueCount = actionItems.filter(
    (a) => (a.status === 'open' || a.status === 'in_progress') && a.due_date && isPast(parseISO(a.due_date))
  ).length

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Action Items</h1>
          <p className="text-gray-600 mt-2">Track your tasks and commitments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={20} />
          New Action Item
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-50 p-2 rounded-lg">
              <CheckSquare className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Items</p>
              <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-50 p-2 rounded-lg">
              <AlertCircle className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Overdue Items</p>
              <p className="text-3xl font-bold text-gray-900">{overdueCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        <FilterButton active={filter === 'open'} onClick={() => setFilter('open')} label="Open" />
        <FilterButton active={filter === 'in_progress'} onClick={() => setFilter('in_progress')} label="In Progress" />
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All" />
        <FilterButton active={filter === 'done'} onClick={() => setFilter('done')} label="Done" />
        <FilterButton active={filter === 'canceled'} onClick={() => setFilter('canceled')} label="Canceled" />
      </div>

      {actionItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <CheckSquare className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No action items yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first action item to start tracking tasks from your sessions.
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Create Action Item
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {actionItems.map((item) => (
            <ActionItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

function ActionItemCard({ item }: { item: ActionItem }) {
  const statusColors = {
    open: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
    canceled: 'bg-gray-100 text-gray-800',
  }

  const isOverdue =
    (item.status === 'open' || item.status === 'in_progress') &&
    item.due_date &&
    isPast(parseISO(item.due_date))

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex gap-4 flex-1">
          <div className={`${item.status === 'done' ? 'bg-green-50' : 'bg-purple-50'} p-3 rounded-lg h-fit`}>
            <CheckSquare className={item.status === 'done' ? 'text-green-600' : 'text-purple-600'} size={24} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                {item.status.replace('_', ' ').charAt(0).toUpperCase() + item.status.slice(1).replace('_', ' ')}
              </span>
              {isOverdue && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1">
                  <AlertCircle size={12} />
                  Overdue
                </span>
              )}
            </div>
            {item.description && (
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              {item.due_date && (
                <div className="flex items-center gap-1">
                  <Calendar size={16} />
                  <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                    Due: {format(parseISO(item.due_date), 'MMM d, yyyy')}
                  </span>
                </div>
              )}
              {item.goal_title && (
                <div className="text-sm text-gray-500">
                  Goal: <span className="font-medium">{item.goal_title}</span>
                </div>
              )}
              {item.session_id && (
                <div className="text-sm text-gray-500">
                  From session #{item.session_id}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {item.status !== 'done' && item.status !== 'canceled' && (
            <button className="text-green-600 hover:text-green-700 font-medium text-sm">
              Mark Done
            </button>
          )}
          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            Edit
          </button>
        </div>
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
