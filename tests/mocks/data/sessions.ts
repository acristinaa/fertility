import type { SessionWithProvider } from "@/components/sessions/types";

export const mockSessions: SessionWithProvider[] = [
  {
    id: 1,
    scheduled_at: "2024-12-15T10:00:00Z",
    duration_minutes: 60,
    status: "scheduled",
    session_type: "consultation",
    mode: "online",
    provider_type: "coach",
    provider_name: "Dr. Sarah Johnson",
    client_rating: null,
  },
  {
    id: 2,
    scheduled_at: "2024-11-20T14:00:00Z",
    duration_minutes: 45,
    status: "completed",
    session_type: "follow-up",
    mode: "in-person",
    provider_type: "doctor",
    provider_name: "Dr. Michael Lee",
    client_rating: 5,
  },
  {
    id: 3,
    scheduled_at: "2024-10-10T09:00:00Z",
    duration_minutes: 30,
    status: "canceled",
    session_type: "standard",
    mode: "online",
    provider_type: "coach",
    provider_name: null, // Test edge case: no provider name
    client_rating: null,
  },
];

export function createMockSession(
  overrides: Partial<SessionWithProvider> = {}
): SessionWithProvider {
  return {
    id: Math.floor(Math.random() * 10000),
    scheduled_at: new Date().toISOString(),
    duration_minutes: 60,
    status: "scheduled",
    session_type: "standard",
    mode: "online",
    provider_type: "coach",
    provider_name: "Test Provider",
    client_rating: null,
    ...overrides,
  };
}