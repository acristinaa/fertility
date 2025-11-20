export interface Program {
  id: number;
  title: string;
  description: string | null;
  status: "active" | "completed" | "paused" | "canceled";
  start_date: string | null;
  end_date: string | null;
  provider_type: string;
  provider_name: string | null;
  created_at: string;
}