"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, Target, CheckSquare, TrendingUp } from "lucide-react";
import { format, parseISO } from "date-fns";

interface DashboardStats {
  upcomingSessions: number;
  activeGoals: number;
  pendingActionItems: number;
  completedSessions: number;
}

interface UpcomingSession {
  id: number;
  scheduled_at: string;
  provider_id: string;
  provider_type: string;
  duration_minutes: number;
  session_type: string;
  provider_name: string | null;
}

// Add this new type for the raw Supabase response
type SessionWithProvider = {
  id: number;
  scheduled_at: string;
  provider_id: string;
  provider_type: string;
  duration_minutes: number;
  session_type: string;
  provider: { full_name: string } | null;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    upcomingSessions: 0,
    activeGoals: 0,
    pendingActionItems: 0,
    completedSessions: 0,
  });
  const [upcomingSessions, setUpcomingSessions] = useState<UpcomingSession[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      // In a real app, you would get the current user's ID from auth
      const userId = "11111111-1111-1111-1111-111111111008";

      // Fetch recent sessions (any status) for this client
      // Fetch recent sessions (any status) for this client
      // Fetch recent sessions (any status) for this client
      const { data: sessions, error } = await supabase
        .from("sessions")
        .select(
          `
        id,
        scheduled_at,
        provider_id,
        provider_type,
        duration_minutes,
        session_type,
        provider:profiles!sessions_provider_id_fkey(full_name)
      `
        )
        .eq("client_id", userId)
        .order("scheduled_at", { ascending: false })
        .limit(5);

      console.log("DASHBOARD raw sessions from Supabase:", sessions);
      console.log("DASHBOARD sessions error:", error);

      // Fetch active goals
      const { count: goalsCount } = await supabase
        .from("goals")
        .select("*", { count: "exact", head: true })
        .eq("client_id", userId)
        .eq("status", "active");

      // Fetch pending action items
      const { count: actionItemsCount } = await supabase
        .from("action_items")
        .select("*", { count: "exact", head: true })
        .eq("client_id", userId)
        .in("status", ["open", "in_progress"]);

      // Fetch completed sessions count
      const { count: completedCount } = await supabase
        .from("sessions")
        .select("*", { count: "exact", head: true })
        .eq("client_id", userId)
        .eq("status", "completed");

      setStats({
        upcomingSessions: sessions?.length || 0,
        activeGoals: goalsCount || 0,
        pendingActionItems: actionItemsCount || 0,
        completedSessions: completedCount || 0,
      });

      setUpcomingSessions(
        ((sessions as SessionWithProvider[]) || []).map((s) => ({
          id: s.id,
          scheduled_at: s.scheduled_at,
          provider_id: s.provider_id,
          provider_type: s.provider_type,
          duration_minutes: s.duration_minutes,
          session_type: s.session_type,
          provider_name: s.provider?.full_name || null,
        }))
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    console.log("DASHBOARD upcomingSessions state:", upcomingSessions);
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here&apos;s your overview.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Calendar className="text-blue-600" size={24} />}
          title="Upcoming Sessions"
          value={stats.upcomingSessions}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<Target className="text-green-600" size={24} />}
          title="Active Goals"
          value={stats.activeGoals}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<CheckSquare className="text-purple-600" size={24} />}
          title="Action Items"
          value={stats.pendingActionItems}
          bgColor="bg-purple-50"
        />
        <StatCard
          icon={<TrendingUp className="text-orange-600" size={24} />}
          title="Completed Sessions"
          value={stats.completedSessions}
          bgColor="bg-orange-50"
        />
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Upcoming Sessions
        </h2>
        {upcomingSessions.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No upcoming sessions scheduled
          </p>
        ) : (
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Calendar className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {session.session_type.charAt(0).toUpperCase() +
                        session.session_type.slice(1)}{" "}
                      Session
                    </h3>
                    <p className="text-sm text-gray-600">
                      with {session.provider_name || "Provider"} (
                      {session.provider_type})
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(parseISO(session.scheduled_at), "PPP")} at{" "}
                      {format(parseISO(session.scheduled_at), "p")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-600">
                    {session.duration_minutes} min
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  bgColor,
}: {
  icon: React.ReactNode;
  title: string;
  value: number;
  bgColor: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
      </div>
    </div>
  );
}
