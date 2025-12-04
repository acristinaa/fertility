import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ClientsPage from "@/app/clients/page";
import { mockSupabaseClient, resetSupabaseMock } from "../mocks/supabase";

// Mock data for the test
const mockLinks = [{ client_id: "client-1" }, { client_id: "client-2" }];

const mockProfiles = [
  {
    id: "client-1",
    full_name: "Jane Doe",
    email: "jane@example.com",
    phone: "+1234567890",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: "client-2",
    full_name: "John Smith",
    email: "john@example.com",
    phone: null,
    created_at: "2024-03-20T14:30:00Z",
  },
];

describe("ClientsPage Integration", () => {
  beforeEach(() => {
    resetSupabaseMock();
  });

  // Helper to setup Supabase mock chain
  function setupSupabaseMock(
    links: typeof mockLinks,
    profiles: typeof mockProfiles
  ) {
    mockSupabaseClient.from.mockImplementation((table: string) => {
      // Return different data based on which table is queried
      if (table === "client_coach_links") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => Promise.resolve({ data: links, error: null }),
            }),
          }),
        };
      }
      if (table === "profiles") {
        return {
          select: () => ({
            in: () => ({
              eq: () => Promise.resolve({ data: profiles, error: null }),
            }),
          }),
        };
      }
      if (table === "programs" || table === "sessions") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                gte: () => Promise.resolve({ data: [], error: null, count: 0 }),
              }),
            }),
          }),
        };
      }
      return mockSupabaseClient;
    });
  }

  it("displays loading state initially", () => {
    setupSupabaseMock(mockLinks, mockProfiles);
    render(<ClientsPage />);

    expect(screen.getByText("Loading clients...")).toBeInTheDocument();
  });

  it("renders client cards after loading", async () => {
    setupSupabaseMock(mockLinks, mockProfiles);
    render(<ClientsPage />);

    await waitFor(() => {
      expect(screen.queryByText("Loading clients...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });

  it("shows empty state when no clients exist", async () => {
    setupSupabaseMock([], []);
    render(<ClientsPage />);

    await waitFor(() => {
      expect(screen.getByText("No clients yet")).toBeInTheDocument();
    });

    expect(
      screen.getByText("Clients will appear here once they connect with you")
    ).toBeInTheDocument();
  });

  it("filters clients by search query", async () => {
    setupSupabaseMock(mockLinks, mockProfiles);
    const user = userEvent.setup();

    render(<ClientsPage />);

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      "Search by name or email..."
    );
    await user.type(searchInput, "jane");

    expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    expect(screen.queryByText("John Smith")).not.toBeInTheDocument();
  });

  it('shows "No clients found" when search has no matches', async () => {
    setupSupabaseMock(mockLinks, mockProfiles);
    const user = userEvent.setup();

    render(<ClientsPage />);

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      "Search by name or email..."
    );
    await user.type(searchInput, "nonexistent");

    expect(screen.getByText("No clients found")).toBeInTheDocument();
    expect(
      screen.getByText("Try adjusting your search query")
    ).toBeInTheDocument();
  });

  it("searches by email as well as name", async () => {
    setupSupabaseMock(mockLinks, mockProfiles);
    const user = userEvent.setup();

    render(<ClientsPage />);

    await waitFor(() => {
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      "Search by name or email..."
    );
    await user.type(searchInput, "john@example.com");

    expect(screen.queryByText("Jane Doe")).not.toBeInTheDocument();
    expect(screen.getByText("John Smith")).toBeInTheDocument();
  });
});
