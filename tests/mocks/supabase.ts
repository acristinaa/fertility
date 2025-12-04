// Mock Supabase client for unit/integration tests
// This ensures tests are FAST and REPRODUCIBLE (no real database calls)

/* eslint-disable @typescript-eslint/no-explicit-any */
type MockSupabaseClient = {
  from: jest.Mock<any, any>;
  select: jest.Mock<any, any>;
  insert: jest.Mock<any, any>;
  update: jest.Mock<any, any>;
  delete: jest.Mock<any, any>;
  eq: jest.Mock<any, any>;
  in: jest.Mock<any, any>;
  gte: jest.Mock<any, any>;
  lte: jest.Mock<any, any>;
  order: jest.Mock<any, any>;
  limit: jest.Mock<any, any>;
  single: jest.Mock<any, any>;
  then: jest.Mock<any, any>;
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export const mockSupabaseClient: MockSupabaseClient = {
  from: jest.fn(() => mockSupabaseClient),
  select: jest.fn(() => mockSupabaseClient),
  insert: jest.fn(() => mockSupabaseClient),
  update: jest.fn(() => mockSupabaseClient),
  delete: jest.fn(() => mockSupabaseClient),
  eq: jest.fn(() => mockSupabaseClient),
  in: jest.fn(() => mockSupabaseClient),
  gte: jest.fn(() => mockSupabaseClient),
  lte: jest.fn(() => mockSupabaseClient),
  order: jest.fn(() => mockSupabaseClient),
  limit: jest.fn(() => mockSupabaseClient),
  single: jest.fn(() => mockSupabaseClient),
  then: jest.fn((callback) => callback({ data: [], error: null })),
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
      (mock as jest.Mock).mockClear();
    }
  });
}

jest.mock("@/lib/supabase", () => ({
  supabase: mockSupabaseClient,
}));