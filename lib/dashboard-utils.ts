import { supabase } from "./supabase";

/**
 * Dashboard utility functions
 * Provides data fetching and transformation logic for the dashboard
 */

export type SessionWithProvider = {
  id: number;
  scheduled_at: string;
  provider_id: string;
  provider_type: string;
  duration_minutes: number;
  session_type: string;
  provider: { full_name: string } | null;
};

export type UpcomingSession = {
  id: number;
  scheduled_at: string;
  provider_id: string;
  provider_type: string;
  duration_minutes: number;
  session_type: string;
  provider_name: string | null;
};

/**
 * Transforms raw session data from database to UI-friendly format
 * Separates data transformation from data fetching (SRP)
 */
export function transformSessionData(
  sessions: SessionWithProvider[]
): UpcomingSession[] {
  return sessions.map((session) => ({
    id: session.id,
    scheduled_at: session.scheduled_at,
    provider_id: session.provider_id,
    provider_type: session.provider_type,
    duration_minutes: session.duration_minutes,
    session_type: session.session_type,
    provider_name: session.provider?.full_name || null,
  }));
}

/**
 * Fetches count of active goals for a client
 * Single purpose: retrieve active goals count
 */
export async function fetchActiveGoalsCount(userId: string): Promise<number> {
  const { count } = await supabase
    .from("goals")
    .select("*", { count: "exact", head: true })
    .eq("client_id", userId)
    .eq("status", "active");

  return count || 0;
}

/**
 * Fetches count of pending action items for a client
 * Single purpose: retrieve pending action items count
 */
export async function fetchPendingActionItemsCount(
  userId: string
): Promise<number> {
  const { count } = await supabase
    .from("action_items")
    .select("*", { count: "exact", head: true })
    .eq("client_id", userId)
    .in("status", ["open", "in_progress"]);

  return count || 0;
}

/**
 * Fetches count of completed sessions for a client
 * Single purpose: retrieve completed sessions count
 */
export async function fetchCompletedSessionsCount(
  userId: string
): Promise<number> {
  const { count } = await supabase
    .from("sessions")
    .select("*", { count: "exact", head: true })
    .eq("client_id", userId)
    .eq("status", "completed");

  return count || 0;
}
