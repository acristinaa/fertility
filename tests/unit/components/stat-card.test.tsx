import { render, screen } from "@testing-library/react";
import { StatCard } from "@/components/layout/stat-card";

describe("StatCard", () => {
  const mockIcon = <span data-testid="mock-icon">📊</span>;

  it("renders the icon", () => {
    render(<StatCard icon={mockIcon} label="Test Label" value={42} />);

    expect(screen.getByTestId("mock-icon")).toBeInTheDocument();
  });

  it("renders the label", () => {
    render(<StatCard icon={mockIcon} label="Active Users" value={100} />);

    expect(screen.getByText("Active Users")).toBeInTheDocument();
  });

  it("renders the value", () => {
    render(<StatCard icon={mockIcon} label="Test" value={12345} />);

    expect(screen.getByText("12345")).toBeInTheDocument();
  });

  it("handles zero value", () => {
    render(<StatCard icon={mockIcon} label="Test" value={0} />);

    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("has the correct CSS classes for styling", () => {
    const { container } = render(
      <StatCard icon={mockIcon} label="Test" value={5} />
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("bg-white", "rounded-lg", "shadow-sm");
  });
});