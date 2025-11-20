export interface Client {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  created_at: string;
  active_programs: number;
  upcoming_sessions: number;
}