export interface Goal {
  id: number;
  title: string;
  description: string | null;
  status: "active" | "achieved" | "dropped";
  target_date: string | null;
  created_at: string;
  program_title: string | null;
}