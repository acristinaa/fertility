import type { Client } from "@/components/clients/types";

export const mockClients: Client[] = [
  {
    id: "client-1",
    full_name: "Jane Doe",
    email: "jane@example.com",
    phone: "+1234567890",
    created_at: "2024-01-15T10:00:00Z",
    active_programs: 2,
    upcoming_sessions: 3,
  },
  {
    id: "client-2",
    full_name: "John Smith",
    email: "john@example.com",
    phone: null,
    created_at: "2024-03-20T14:30:00Z",
    active_programs: 0,
    upcoming_sessions: 1,
  },
  {
    id: "client-3",
    full_name: null, // Test edge case: unnamed client
    email: "anonymous@example.com",
    phone: null,
    created_at: "2024-06-01T09:00:00Z",
    active_programs: 1,
    upcoming_sessions: 0,
  },
];

// Factory function for creating test clients with custom properties
export function createMockClient(overrides: Partial<Client> = {}): Client {
  return {
    id: `client-${Math.random().toString(36).substr(2, 9)}`,
    full_name: "Test Client",
    email: "test@example.com",
    phone: null,
    created_at: new Date().toISOString(),
    active_programs: 0,
    upcoming_sessions: 0,
    ...overrides,
  };
}