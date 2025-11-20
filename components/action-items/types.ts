export interface ActionItem {
  id: number;
  title: string;
  description: string | null;
  status: "open" | "in_progress" | "done" | "canceled";
  due_date: string | null;
  created_at: string;
  goal_title: string | null;
  session_id: number | null;
}
