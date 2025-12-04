/**
 * Pure functions for session-related business logic.
 * These are easy to test because they have no side effects.
 */

const CANCELLATION_WINDOW_HOURS = 24;

/**
 * Determines if a session can still be canceled.
 * Sessions can only be canceled more than 24 hours in advance.
 *
 * @param scheduledAt - ISO date string of the session
 * @returns true if cancellation is allowed
 */
export function canCancelSession(scheduledAt: string): boolean {
  const sessionTime = new Date(scheduledAt).getTime();
  const now = Date.now();
  const hoursUntilSession = (sessionTime - now) / (1000 * 60 * 60);

  return hoursUntilSession > CANCELLATION_WINDOW_HOURS;
}

/**
 * Gets the deadline by which a session must be canceled.
 *
 * @param scheduledAt - ISO date string of the session
 * @returns Date object representing the cancellation deadline
 */
export function getSessionCancellationDeadline(scheduledAt: string): Date {
  const sessionTime = new Date(scheduledAt);
  return new Date(
    sessionTime.getTime() - CANCELLATION_WINDOW_HOURS * 60 * 60 * 1000
  );
}