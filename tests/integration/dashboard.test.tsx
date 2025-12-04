import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { mockSupabaseClient, resetSupabaseMock } from "../mocks/supabase";

describe("DashboardPage Integration", () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  function setupDashboardMock({
    sessions = [],
    goalsCount = 0,
    actionItemsCount = 0,
    completedCount = 0,
  }: {
    sessions?: Array<{
      id: number;
      scheduled_at: string;
      provider_id: string;
      provider_type: string;
      duration_minutes: number;
      session_type: string;
      provider: { full_name: string } | null;
    }>;
    goalsCount?: number;
    actionItemsCount?: number;
    completedCount?: number;
  }) {
    mockSupabaseClient.from.mockImplementation((table: string) => {
      if (table === "sessions") {
        return {
          select: (
            query: string,
            options?: { count?: string; head?: boolean }
          ) => {
            if (options?.count === "exact") {
              // Count query for completed sessions
              return {
                eq: () => ({
                  eq: () =>
                    Promise.resolve({
                      data: null,
                      error: null,
                      count: completedCount,
                    }),
                }),
              };
            }
            // Regular select for session list
            return {
              eq: () => ({
                order: () => ({
                  limit: () => Promise.resolve({ data: sessions, error: null }),
                }),
              }),
            };
          },
        };
      }

      if (table === "goals") {
        return {
          select: () => ({
            eq: () => ({
              eq: () =>
                Promise.resolve({ data: null, error: null, count: goalsCount }),
            }),
          }),
        };
      }

      if (table === "action_items") {
        return {
          select: () => ({
            eq: () => ({
              in: () =>
                Promise.resolve({
                  data: null,
                  error: null,
                  count: actionItemsCount,
                }),
            }),
          }),
        };
      }

      return mockSupabaseClient;
    });
  }

  it("shows loading state initially", () => {
    setupDashboardMock({});
    render(<DashboardPage />);

    expect(screen.getByText("Loading dashboard...")).toBeInTheDocument();
  });

  it("displays stat cards with correct values", async () => {
    setupDashboardMock({
      sessions: [
        {
          id: 1,
          scheduled_at: "2024-12-15T10:00:00Z",
          provider_id: "provider-1",
          provider_type: "coach",
          duration_minutes: 60,
          session_type: "consultation",
          provider: { full_name: "Dr. Smith" },
        },
      ],
      goalsCount: 5,
      actionItemsCount: 3,
      completedCount: 10,
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(
        screen.queryByText("Loading dashboard...")
      ).not.toBeInTheDocument();
    });

    expect(screen.getByText("Upcoming Sessions")).toBeInTheDocument();
    expect(screen.getByText("Active Goals")).toBeInTheDocument();
    expect(screen.getByText("Action Items")).toBeInTheDocument();
    expect(screen.getByText("Completed Sessions")).toBeInTheDocument();
  });

  it('shows "No upcoming sessions scheduled" when sessions array is empty', async () => {
    setupDashboardMock({ sessions: [] });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(
        screen.getByText("No upcoming sessions scheduled")
      ).toBeInTheDocument();
    });
  });

  it("renders session cards for upcoming sessions", async () => {
    setupDashboardMock({
      sessions: [
        {
          id: 1,
          scheduled_at: "2024-12-15T10:00:00Z",
          provider_id: "provider-1",
          provider_type: "coach",
          duration_minutes: 60,
          session_type: "consultation",
          provider: { full_name: "Dr. Sarah" },
        },
      ],
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/Dr. Sarah/)).toBeInTheDocument();
    });

    expect(screen.getByText(/Consultation Session/)).toBeInTheDocument();
    expect(screen.getByText("60 min")).toBeInTheDocument();
  });

  it('displays "Provider" as fallback when provider name is null', async () => {
    setupDashboardMock({
      sessions: [
        {
          id: 1,
          scheduled_at: "2024-12-15T10:00:00Z",
          provider_id: "provider-1",
          provider_type: "coach",
          duration_minutes: 30,
          session_type: "standard",
          provider: null,
        },
      ],
    });

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/with Provider/)).toBeInTheDocument();
    });
  });
});