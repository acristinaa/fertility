export interface SessionWithProvider {
  id: number;
  scheduled_at: string;
  duration_minutes: number;
  status: "scheduled" | "completed" | "canceled";
  session_type: string;
  mode: string;
  provider_type: "coach" | "doctor";
  provider_name: string | null;
  client_rating: number | null;
}