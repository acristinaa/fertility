"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, Target, CheckSquare, TrendingUp } from "lucide-react";
import { format, parseISO } from "date-fns";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import {
  transformSessionData,
  fetchActiveGoalsCount,
  fetchPendingActionItemsCount,
  fetchCompletedSessionsCount,
  type SessionWithProvider,
  type UpcomingSession,
} from "@/lib/dashboard-utils";

interface DashboardStats {
  upcomingSessions: number;
  activeGoals: number;
  pendingActionItems: number;
  completedSessions: number;
}

// TODO: Replace with actual authenticated user ID from Supabase Auth
const DEMO_USER_ID = "11111111-1111-1111-1111-111111111008";

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
    async function fetchDashboardData() {
      try {
        const userId = DEMO_USER_ID;

        // Fetch all dashboard data concurrently for better performance
        const [sessions, goalsCount, actionItemsCount, completedCount] =
          await Promise.all([
            // Fetch recent sessions with provider details
            supabase
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
              .limit(5)
              .then(({ data }) => data),
            fetchActiveGoalsCount(userId),
            fetchPendingActionItemsCount(userId),
            fetchCompletedSessionsCount(userId),
          ]);

        setStats({
          upcomingSessions: sessions?.length || 0,
          activeGoals: goalsCount,
          pendingActionItems: actionItemsCount,
          completedSessions: completedCount,
        });

        const typedSessions = (sessions ?? []) as SessionWithProvider[];
        setUpcomingSessions(transformSessionData(typedSessions));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
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
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back! Here's your overview."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={
            <div className="bg-blue-50 p-3 rounded-lg">
              <Calendar className="text-blue-600" size={24} />
            </div>
          }
          label="Upcoming Sessions"
          value={stats.upcomingSessions}
        />
        <StatCard
          icon={
            <div className="bg-green-50 p-3 rounded-lg">
              <Target className="text-green-600" size={24} />
            </div>
          }
          label="Active Goals"
          value={stats.activeGoals}
        />
        <StatCard
          icon={
            <div className="bg-purple-50 p-3 rounded-lg">
              <CheckSquare className="text-purple-600" size={24} />
            </div>
          }
          label="Action Items"
          value={stats.pendingActionItems}
        />
        <StatCard
          icon={
            <div className="bg-orange-50 p-3 rounded-lg">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
          }
          label="Completed Sessions"
          value={stats.completedSessions}
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