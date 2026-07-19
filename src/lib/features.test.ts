import { describe, expect, it } from "vitest";

import { FEATURES } from "./features";

describe("FEATURES", () => {
  it("lists multiple marketing features", () => {
    expect(FEATURES.length).toBeGreaterThan(1);
  });

  it("gives every feature an icon, title and description", () => {
    for (const feature of FEATURES) {
      expect(feature.icon).toBeTruthy();
      expect(feature.title.length).toBeGreaterThan(0);
      expect(feature.description.length).toBeGreaterThan(0);
    }
  });

  it("has unique feature titles", () => {
    const titles = FEATURES.map((f) => f.title);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
