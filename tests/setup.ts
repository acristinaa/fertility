import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import { mockSupabaseClient } from "./mocks/supabase";

// Mock Supabase using our shared mock client
vi.mock("@/lib/supabase", () => ({
  supabase: mockSupabaseClient,
}));

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
  }),
  usePathname: () => "/dashboard",
  useSearchParams: () => new URLSearchParams(),
}));
