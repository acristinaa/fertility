import { render, screen } from "@testing-library/react";
import { Navigation } from "@/components/navigation";

// Mock usePathname to control active state
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

import { usePathname } from "next/navigation";

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe("Navigation", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/dashboard");
  });

  describe("common navigation items", () => {
    it("always shows Dashboard link", () => {
      render(<Navigation role="client" />);
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });

    it("always shows Sessions link", () => {
      render(<Navigation role="client" />);
      expect(screen.getByText("Sessions")).toBeInTheDocument();
    });

    it("always shows Profile link", () => {
      render(<Navigation role="client" />);
      expect(screen.getByText("Profile")).toBeInTheDocument();
    });
  });

  describe("role-based navigation", () => {
    it("shows Programs, Goals, Action Items for client role", () => {
      render(<Navigation role="client" />);

      expect(screen.getByText("Programs")).toBeInTheDocument();
      expect(screen.getByText("Goals")).toBeInTheDocument();
      expect(screen.getByText("Action Items")).toBeInTheDocument();
    });

    it("shows Clients link for coach role", () => {
      render(<Navigation role="coach" />);

      expect(screen.getByText("Clients")).toBeInTheDocument();
    });

    it("shows Clients link for doctor role", () => {
      render(<Navigation role="doctor" />);

      expect(screen.getByText("Clients")).toBeInTheDocument();
    });

    it("shows Clients link for admin role", () => {
      render(<Navigation role="admin" />);

      expect(screen.getByText("Clients")).toBeInTheDocument();
    });

    it("does NOT show Clients link for client role", () => {
      render(<Navigation role="client" />);

      expect(screen.queryByText("Clients")).not.toBeInTheDocument();
    });

    it("does NOT show Programs/Goals/Action Items for admin role", () => {
      render(<Navigation role="admin" />);

      expect(screen.queryByText("Programs")).not.toBeInTheDocument();
      expect(screen.queryByText("Goals")).not.toBeInTheDocument();
      expect(screen.queryByText("Action Items")).not.toBeInTheDocument();
    });
  });

  describe("role portal label", () => {
    it.each(["client", "coach", "doctor", "admin"] as const)(
      'displays "%s Portal" text',
      (role) => {
        render(<Navigation role={role} />);

        expect(
          screen.getByText(
            `${role.charAt(0).toUpperCase() + role.slice(1)} Portal`
          )
        ).toBeInTheDocument();
      }
    );
  });

  describe("active state", () => {
    it("highlights active link based on current pathname", () => {
      mockUsePathname.mockReturnValue("/sessions");
      render(<Navigation role="client" />);

      const sessionsLink = screen.getByText("Sessions").closest("a");
      expect(sessionsLink).toHaveClass("bg-blue-50", "text-blue-700");
    });

    it("does not highlight inactive links", () => {
      mockUsePathname.mockReturnValue("/dashboard");
      render(<Navigation role="client" />);

      const sessionsLink = screen.getByText("Sessions").closest("a");
      expect(sessionsLink).not.toHaveClass("bg-blue-50");
      expect(sessionsLink).toHaveClass("text-gray-700");
    });
  });

  describe("branding", () => {
    it("displays the app name", () => {
      render(<Navigation role="client" />);

      expect(screen.getByText("Fertility Care")).toBeInTheDocument();
    });
  });
});