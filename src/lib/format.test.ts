import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  calcAge,
  formatBytes,
  formatDate,
  formatDateTime,
  initials,
  isExpired,
  relativeTime,
} from "./format";

describe("calcAge", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-18T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // calcAge derives age from the epoch offset of (now - dob).
  it("computes whole years since the date of birth", () => {
    expect(calcAge("2000-07-18")).toBe(26);
  });

  it("rounds down before the birthday has occurred this year", () => {
    expect(calcAge("2000-12-31")).toBe(25);
  });

  it("returns 0 for a date of birth within the current year", () => {
    expect(calcAge("2026-01-01")).toBe(0);
  });
});

describe("formatDate", () => {
  it("uses the day/short-month/year default format", () => {
    // Constructed with local components to avoid timezone-shift ambiguity.
    expect(formatDate(new Date(2025, 5, 10))).toBe("10 Jun 2025");
  });

  it("respects custom Intl options", () => {
    expect(formatDate(new Date(2025, 5, 10), { month: "long" })).toBe("June");
  });

  it("accepts an ISO date string", () => {
    expect(formatDate("2025-01-05T12:00:00Z")).toMatch(/2025/);
  });
});

describe("formatDateTime", () => {
  it("includes both the date and the time", () => {
    const out = formatDateTime(new Date(2025, 5, 10, 14, 5));
    expect(out).toContain("Jun");
    expect(out).toContain("2025");
    expect(out).toMatch(/\d{1,2}:\d{2}/);
  });
});

describe("initials", () => {
  it("takes the first two uppercase initials", () => {
    expect(initials("Aarav Sharma")).toBe("AS");
  });

  it("caps at two letters for longer names", () => {
    expect(initials("Ravi Kumar Singh")).toBe("RK");
  });

  it("handles a single-word name", () => {
    expect(initials("Priya")).toBe("P");
  });

  it("ignores extra whitespace", () => {
    expect(initials("  John   Doe ")).toBe("JD");
  });
});

describe("formatBytes", () => {
  it("shows megabytes below 1024 with no decimals", () => {
    expect(formatBytes(512)).toBe("512 MB");
  });

  it("shows gigabytes with two decimals at or above 1024", () => {
    expect(formatBytes(2048)).toBe("2.00 GB");
  });

  it("rounds the megabyte value", () => {
    expect(formatBytes(100.7)).toBe("101 MB");
  });
});

describe("isExpired", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-18T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns false when no date is provided", () => {
    expect(isExpired()).toBe(false);
  });

  it("returns true for a past date", () => {
    expect(isExpired("2020-01-01")).toBe(true);
  });

  it("returns false for a future date", () => {
    expect(isExpired("2030-01-01")).toBe(false);
  });
});

describe("relativeTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-18T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats minutes for sub-hour differences", () => {
    expect(relativeTime("2026-07-18T11:30:00Z")).toBe("30 minutes ago");
  });

  it("formats hours within a day", () => {
    expect(relativeTime("2026-07-18T09:00:00Z")).toBe("3 hours ago");
  });

  it("formats future days", () => {
    expect(relativeTime("2026-07-23T12:00:00Z")).toBe("in 5 days");
  });

  it("formats months beyond 30 days", () => {
    expect(relativeTime("2026-10-18T12:00:00Z")).toBe("in 3 months");
  });
});
