import type { ActionItem } from "@/components/action-items/types";

export const mockActionItems: ActionItem[] = [
  {
    id: 1,
    title: "Complete intake form",
    description: "Fill out the initial health questionnaire",
    status: "open",
    due_date: "2024-12-10",
    created_at: "2024-12-01T00:00:00Z",
    goal_title: "Improve sleep schedule",
    session_id: 1,
  },
  {
    id: 2,
    title: "Track daily water intake",
    description: null,
    status: "in_progress",
    due_date: null,
    created_at: "2024-11-20T00:00:00Z",
    goal_title: null,
    session_id: null,
  },
  {
    id: 3,
    title: "Read recommended article",
    description: "Review the fertility nutrition guide",
    status: "done",
    due_date: "2024-11-15",
    created_at: "2024-11-10T00:00:00Z",
    goal_title: "Nutrition planning",
    session_id: 2,
  },
];

export function createMockActionItem(
  overrides: Partial<ActionItem> = {}
): ActionItem {
  return {
    id: Math.floor(Math.random() * 10000),
    title: "Test Action Item",
    description: null,
    status: "open",
    due_date: null,
    created_at: new Date().toISOString(),
    goal_title: null,
    session_id: null,
    ...overrides,
  };
}