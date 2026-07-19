import { describe, expect, it } from "vitest";

import { DEMO_USER } from "./demo-user";

describe("DEMO_USER", () => {
  it("exposes a consistent demo profile", () => {
    expect(DEMO_USER.name).toContain(DEMO_USER.firstName);
    expect(DEMO_USER.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    expect(DEMO_USER.avatarUrl).toMatch(/^https?:\/\//);
    expect(DEMO_USER.plan.length).toBeGreaterThan(0);
  });
});
