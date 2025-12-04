// Mock Supabase client for unit/integration tests
// This ensures tests are FAST and REPRODUCIBLE (no real database calls)

import { vi, type Mock } from "vitest";

type MockSupabaseClient = {
  from: Mock;
  select: Mock;
  insert: Mock;
  update: Mock;
  delete: Mock;
  eq: Mock;
  in: Mock;
  gte: Mock;
  lte: Mock;
  order: Mock;
  limit: Mock;
  single: Mock;
  then: Mock;
};

export const mockSupabaseClient: MockSupabaseClient = {
  from: vi.fn(() => mockSupabaseClient),
  select: vi.fn(() => mockSupabaseClient),
  insert: vi.fn(() => mockSupabaseClient),
  update: vi.fn(() => mockSupabaseClient),
  delete: vi.fn(() => mockSupabaseClient),
  eq: vi.fn(() => mockSupabaseClient),
  in: vi.fn(() => mockSupabaseClient),
  gte: vi.fn(() => mockSupabaseClient),
  lte: vi.fn(() => mockSupabaseClient),
  order: vi.fn(() => mockSupabaseClient),
  limit: vi.fn(() => mockSupabaseClient),
  single: vi.fn(() => mockSupabaseClient),
  then: vi.fn((callback) => callback({ data: [], error: null })),
};

// Helper to mock specific responses
export function mockSupabaseResponse<T>(data: T, error: Error | null = null) {
  return Promise.resolve({
    data,
    error,
    count: Array.isArray(data) ? data.length : 1,
  });
}

// Reset mock between tests
export function resetSupabaseMock() {
  Object.values(mockSupabaseClient).forEach((mock) => {
    if (typeof mock === "function" && "mockClear" in mock) {
      (mock as Mock).mockClear();
    }
  });
}
