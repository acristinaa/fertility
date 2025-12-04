import { render, screen } from "@testing-library/react";
import { SessionCard } from "@/components/sessions/session-card";
import { createMockSession } from "../../mocks/data/sessions";

describe("SessionCard", () => {
  describe("session type display", () => {
    it("capitalizes and displays session type", () => {
      const session = createMockSession({ session_type: "consultation" });
      render(<SessionCard session={session} />);

      expect(screen.getByText(/Consultation Session/)).toBeInTheDocument();
    });
  });

  describe("status badge", () => {
    it.each([
      ["scheduled", /scheduled/i],
      ["completed", /completed/i],
      ["canceled", /canceled/i],
    ])("displays %s status correctly", (status, expectedText) => {
      const session = createMockSession({
        status: status as "scheduled" | "completed" | "canceled",
      });
      render(<SessionCard session={session} />);

      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });

    it("applies correct color class for scheduled status", () => {
      const session = createMockSession({ status: "scheduled" });
      render(<SessionCard session={session} />);

      const badge = screen.getByText(/scheduled/i);
      expect(badge).toHaveClass("bg-blue-100", "text-blue-800");
    });

    it("applies correct color class for completed status", () => {
      const session = createMockSession({ status: "completed" });
      render(<SessionCard session={session} />);

      const badge = screen.getByText(/completed/i);
      expect(badge).toHaveClass("bg-green-100", "text-green-800");
    });

    it("applies correct color class for canceled status", () => {
      const session = createMockSession({ status: "canceled" });
      render(<SessionCard session={session} />);

      const badge = screen.getByText(/canceled/i);
      expect(badge).toHaveClass("bg-red-100", "text-red-800");
    });
  });

  describe("provider information", () => {
    it("displays provider name when available", () => {
      const session = createMockSession({ provider_name: "Dr. Sarah Johnson" });
      render(<SessionCard session={session} />);

      expect(screen.getByText(/Dr. Sarah Johnson/)).toBeInTheDocument();
    });

    it('displays "Provider" as fallback when provider_name is null', () => {
      const session = createMockSession({ provider_name: null });
      render(<SessionCard session={session} />);

      expect(screen.getByText(/with Provider/)).toBeInTheDocument();
    });

    it("displays provider type", () => {
      const session = createMockSession({ provider_type: "doctor" });
      render(<SessionCard session={session} />);

      expect(screen.getByText(/\(doctor\)/)).toBeInTheDocument();
    });
  });

  describe("session mode", () => {
    it('shows video icon and "Online" for online sessions', () => {
      const session = createMockSession({ mode: "online" });
      render(<SessionCard session={session} />);

      expect(screen.getByText("Online")).toBeInTheDocument();
    });

    it('shows location icon and "In-Person" for in-person sessions', () => {
      const session = createMockSession({ mode: "in-person" });
      render(<SessionCard session={session} />);

      expect(screen.getByText("In-Person")).toBeInTheDocument();
    });
  });

  describe("duration display", () => {
    it("displays session duration in minutes", () => {
      const session = createMockSession({ duration_minutes: 45 });
      render(<SessionCard session={session} />);

      expect(screen.getByText(/45 min/)).toBeInTheDocument();
    });
  });

  describe("rating display", () => {
    it("shows rating stars for completed sessions with rating", () => {
      const session = createMockSession({
        status: "completed",
        client_rating: 4,
      });
      render(<SessionCard session={session} />);

      expect(screen.getByText("Your rating:")).toBeInTheDocument();
      expect(screen.getByText("★★★★☆")).toBeInTheDocument();
    });

    it("does not show rating for scheduled sessions", () => {
      const session = createMockSession({
        status: "scheduled",
        client_rating: null,
      });
      render(<SessionCard session={session} />);

      expect(screen.queryByText("Your rating:")).not.toBeInTheDocument();
    });

    it("does not show rating for completed sessions without rating", () => {
      const session = createMockSession({
        status: "completed",
        client_rating: null,
      });
      render(<SessionCard session={session} />);

      expect(screen.queryByText("Your rating:")).not.toBeInTheDocument();
    });
  });
});