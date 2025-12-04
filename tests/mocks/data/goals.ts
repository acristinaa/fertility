import type { Goal } from "@/components/goals/types";

export const mockGoals: Goal[] = [
  {
    id: 1,
    title: "Improve sleep schedule",
    description: "Maintain consistent 10pm-6am sleep schedule",
    status: "active",
    target_date: "2024-12-31",
    created_at: "2024-09-01T00:00:00Z",
    program_title: "Wellness Program",
  },
  {
    id: 2,
    title: "Reduce stress levels",
    description: null,
    status: "achieved",
    target_date: "2024-11-15",
    created_at: "2024-08-15T00:00:00Z",
    program_title: null,
  },
];

export function createMockGoal(overrides: Partial<Goal> = {}): Goal {
  return {
    id: Math.floor(Math.random() * 10000),
    title: "Test Goal",
    description: "Test description",
    status: "active",
    target_date: null,
    created_at: new Date().toISOString(),
    program_title: null,
    ...overrides,
  };
}