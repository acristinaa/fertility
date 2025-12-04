import { render, screen, fireEvent } from "@testing-library/react";
import { EmptyStateCard } from "@/components/common/empty-state-card";

describe("EmptyStateCard", () => {
  it("renders title and description", () => {
    render(
      <EmptyStateCard
        title="No items found"
        description="Try adjusting your filters"
      />
    );

    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(screen.getByText("Try adjusting your filters")).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    render(<EmptyStateCard title="Test" description="Description" />);

    expect(screen.getByTestId("empty-icon")).toBeInTheDocument();
  });

  it("does not render icon section when icon is not provided", () => {
    const { container } = render(
      <EmptyStateCard title="Test" description="Description" />
    );

    // The icon wrapper should not exist
    expect(container.querySelector(".mx-auto.mb-4")).not.toBeInTheDocument();
  });

  it("renders action button when primaryActionLabel is provided", () => {
    render(
      <EmptyStateCard
        title="Test"
        description="Description"
        primaryActionLabel="Create New"
      />
    );

    expect(
      screen.getByRole("button", { name: "Create New" })
    ).toBeInTheDocument();
  });

  it("does not render button when primaryActionLabel is not provided", () => {
    render(<EmptyStateCard title="Test" description="Description" />);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("calls onPrimaryActionClick when button is clicked", () => {
    const handleClick = jest.fn();
    render(
      <EmptyStateCard
        title="Test"
        description="Description"
        primaryActionLabel="Click Me"
        onPrimaryActionClick={handleClick}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Click Me" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});