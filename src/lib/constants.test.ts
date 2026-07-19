import { describe, expect, it } from "vitest";

import {
  AI_DISCLAIMER,
  BLOOD_GROUPS,
  DASHBOARD_NAV,
  MARKETING_NAV,
  RECORD_CATEGORIES,
  RELATIONSHIPS,
  REMINDER_TYPES,
  SITE,
} from "./constants";

describe("SITE", () => {
  it("exposes the core site metadata", () => {
    expect(SITE.name).toBe("MedVault AI");
    expect(SITE.url).toMatch(/^https?:\/\//);
    expect(SITE.tagline.length).toBeGreaterThan(0);
    expect(SITE.description.length).toBeGreaterThan(0);
  });
});

describe("DASHBOARD_NAV", () => {
  it("has an icon and dashboard-scoped href for each item", () => {
    expect(DASHBOARD_NAV.length).toBeGreaterThan(0);
    for (const item of DASHBOARD_NAV) {
      expect(item.title.length).toBeGreaterThan(0);
      expect(item.href.startsWith("/dashboard")).toBe(true);
      expect(item.icon).toBeTruthy();
    }
  });

  it("has unique hrefs", () => {
    const hrefs = DASHBOARD_NAV.map((i) => i.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
  });
});

describe("MARKETING_NAV", () => {
  it("links to root-level marketing pages", () => {
    for (const item of MARKETING_NAV) {
      expect(item.href.startsWith("/")).toBe(true);
      expect(item.title.length).toBeGreaterThan(0);
    }
  });
});

describe("enumeration constants", () => {
  it("expose the expected option sets", () => {
    expect(BLOOD_GROUPS).toContain("O+");
    expect(BLOOD_GROUPS).toHaveLength(8);
    expect(RELATIONSHIPS).toContain("Self");
    expect(RECORD_CATEGORIES).toContain("Prescription");
    expect(REMINDER_TYPES).toContain("Medicine");
  });

  it("contain no duplicate values", () => {
    for (const list of [
      BLOOD_GROUPS,
      RELATIONSHIPS,
      RECORD_CATEGORIES,
      REMINDER_TYPES,
    ]) {
      expect(new Set(list).size).toBe(list.length);
    }
  });
});

describe("AI_DISCLAIMER", () => {
  it("mentions educational-use wording", () => {
    expect(AI_DISCLAIMER.toLowerCase()).toContain("educational purposes");
  });
});
