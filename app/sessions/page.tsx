"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyStateCard } from "@/components/common/empty-state-card";
import { FilterButton } from "@/components/ui/filter-button";
import type { SessionWithProvider } from "@/components/sessions/types";
import { SessionCard } from "@/components/sessions/session-card";

type RawSessionRow = {
  id: number;
  scheduled_at: string;
  duration_minutes: number;
  status: SessionWithProvider["status"];
  session_type: string;
  mode: string;
  provider_type: SessionWithProvider["provider_type"];
  client_rating: number | null;
  provider: { full_name: string | null } | null;
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionWithProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "scheduled" | "completed" | "canceled"
  >("all");

  useEffect(() => {
    async function fetchSessions() {
      try {
        const userId = "11111111-1111-1111-1111-111111111008";

        let query = supabase
          .from("sessions")
          .select(
            `
            id,
            scheduled_at,
            duration_minutes,
            status,
            session_type,
            mode,
            provider_type,
            client_rating,
            provider:profiles!sessions_provider_id_fkey(full_name)
          `
          )
          .eq("client_id", userId)
          .order("scheduled_at", { ascending: false });

        if (filter !== "all") {
          query = query.eq("status", filter);
        }

        const { data } = await query;

        const rows = (data ?? []) as RawSessionRow[];

        setSessions(
          rows.map(
            (s): SessionWithProvider => ({
              id: s.id,
              scheduled_at: s.scheduled_at,
              duration_minutes: s.duration_minutes,
              status: s.status,
              session_type: s.session_type,
              mode: s.mode,
              provider_type: s.provider_type,
              client_rating: s.client_rating,
              provider_name: s.provider?.full_name ?? null,
            })
          )
        );
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, [filter]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading sessions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Sessions"
        subtitle="Manage your coaching and medical appointments"
        primaryActionLabel="Schedule Session"
        primaryActionIcon={<Plus size={20} />}
      />

      <div className="flex gap-2 mb-6">
        <FilterButton
          active={filter === "all"}
          onClick={() => setFilter("all")}
          label="All Sessions"
        />
        <FilterButton
          active={filter === "scheduled"}
          onClick={() => setFilter("scheduled")}
          label="Scheduled"
        />
        <FilterButton
          active={filter === "completed"}
          onClick={() => setFilter("completed")}
          label="Completed"
        />
        <FilterButton
          active={filter === "canceled"}
          onClick={() => setFilter("canceled")}
          label="Canceled"
        />
      </div>

      {sessions.length === 0 ? (
        <EmptyStateCard
          icon={<Calendar className="text-gray-400" size={48} />}
          title="No sessions found"
          description={
            filter === "all"
              ? "You don't have any sessions yet. Schedule your first session to get started."
              : `No ${filter} sessions found.`
          }
          primaryActionLabel="Schedule a Session"
        />
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}