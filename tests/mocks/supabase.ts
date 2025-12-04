// Mock Supabase client for unit/integration tests
// This ensures tests are FAST and REPRODUCIBLE (no real database calls)

type MockSupabaseClient = {
    from: jest.Mock<MockSupabaseClient>;
    select: jest.Mock<MockSupabaseClient>;
    insert: jest.Mock<MockSupabaseClient>;
    update: jest.Mock<MockSupabaseClient>;
    delete: jest.Mock<MockSupabaseClient>;
    eq: jest.Mock<MockSupabaseClient>;
    in: jest.Mock<MockSupabaseClient>;
    gte: jest.Mock<MockSupabaseClient>;
    lte: jest.Mock<MockSupabaseClient>;
    order: jest.Mock<MockSupabaseClient>;
    limit: jest.Mock<MockSupabaseClient>;
    single: jest.Mock<MockSupabaseClient>;
    then: jest.Mock;
  };
  
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
    // Default return value
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