import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  canCancelSession,
  getSessionCancellationDeadline,
} from "../../../lib/session-helpers";

describe("canCancelSession", () => {
  const now = new Date("2024-12-04T12:00:00Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns true when session is more than 24 hours away", () => {
    const scheduledAt = "2024-12-06T12:00:00Z";
    expect(canCancelSession(scheduledAt)).toBe(true);
  });

  it("returns false when session is less than 24 hours away", () => {
    const scheduledAt = "2024-12-05T10:00:00Z";
    expect(canCancelSession(scheduledAt)).toBe(false);
  });

  it("returns false when session is exactly 24 hours away", () => {
    const scheduledAt = "2024-12-05T12:00:00Z";
    expect(canCancelSession(scheduledAt)).toBe(false);
  });

  it("returns false when session is in the past", () => {
    const scheduledAt = "2024-12-03T12:00:00Z";
    expect(canCancelSession(scheduledAt)).toBe(false);
  });
});

describe("getSessionCancellationDeadline", () => {
  it("returns the date 24 hours before the session", () => {
    const scheduledAt = "2024-12-10T14:00:00Z";
    const deadline = getSessionCancellationDeadline(scheduledAt);

    expect(deadline.toISOString()).toBe("2024-12-09T14:00:00.000Z");
  });
});