import { render, screen } from "@testing-library/react";
import { ClientCard } from "@/components/clients/client-card";
import { createMockClient, mockClients } from "../../mocks/data/clients";

describe("ClientCard", () => {
  // TEST BEHAVIOR, NOT IMPLEMENTATION
  // We test what the user sees, not internal state

  describe("rendering client information", () => {
    it("displays the client full name", () => {
      const client = mockClients[0]; // Jane Doe
      render(<ClientCard client={client} />);

      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });

    it('displays "Unnamed Client" when full_name is null', () => {
      const client = createMockClient({ full_name: null });
      render(<ClientCard client={client} />);

      expect(screen.getByText("Unnamed Client")).toBeInTheDocument();
    });

    it("displays email when provided", () => {
      const client = createMockClient({ email: "test@example.com" });
      render(<ClientCard client={client} />);

      expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("does not render email section when email is null", () => {
      const client = createMockClient({ email: null });
      render(<ClientCard client={client} />);

      // The email icon/section should not be present
      expect(screen.queryByText("@")).not.toBeInTheDocument();
    });

    it("displays phone when provided", () => {
      const client = createMockClient({ phone: "+1234567890" });
      render(<ClientCard client={client} />);

      expect(screen.getByText("+1234567890")).toBeInTheDocument();
    });

    it("does not render phone section when phone is null", () => {
      const client = createMockClient({ phone: null });
      const { container } = render(<ClientCard client={client} />);

      // Check that phone number pattern is not in the document
      expect(container.textContent).not.toMatch(/\+\d+/);
    });
  });

  describe("displaying statistics", () => {
    it("shows active programs count", () => {
      const client = createMockClient({ active_programs: 5 });
      render(<ClientCard client={client} />);

      expect(screen.getByText("5")).toBeInTheDocument();
      expect(screen.getByText("Active Programs")).toBeInTheDocument();
    });

    it("shows upcoming sessions count", () => {
      const client = createMockClient({ upcoming_sessions: 3 });
      render(<ClientCard client={client} />);

      expect(screen.getByText("3")).toBeInTheDocument();
      expect(screen.getByText("Upcoming Sessions")).toBeInTheDocument();
    });

    it("handles zero values correctly", () => {
      const client = createMockClient({
        active_programs: 0,
        upcoming_sessions: 0,
      });
      render(<ClientCard client={client} />);

      // Should show "0" for both stats
      const zeros = screen.getAllByText("0");
      expect(zeros).toHaveLength(2);
    });
  });

  describe("date formatting", () => {
    it("formats the client since date correctly", () => {
      const client = createMockClient({
        created_at: "2024-01-15T10:00:00Z",
      });
      render(<ClientCard client={client} />);

      expect(screen.getByText(/Client since Jan 2024/)).toBeInTheDocument();
    });
  });

  describe("interaction", () => {
    it("renders View Profile button", () => {
      const client = createMockClient();
      render(<ClientCard client={client} />);

      expect(
        screen.getByRole("button", { name: /view profile/i })
      ).toBeInTheDocument();
    });
  });
});