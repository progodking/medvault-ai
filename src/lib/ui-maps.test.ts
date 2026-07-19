import { describe, expect, it } from "vitest";

import { RECORD_CATEGORIES, REMINDER_TYPES } from "./constants";
import {
  ACTIVITY_ICON,
  CATEGORY_ICON,
  CATEGORY_TONE,
  REMINDER_ICON,
} from "./ui-maps";

describe("REMINDER_ICON", () => {
  it("has an icon for every reminder type", () => {
    for (const type of REMINDER_TYPES) {
      expect(REMINDER_ICON[type]).toBeTruthy();
    }
  });
});

describe("CATEGORY_ICON", () => {
  it("has an icon for every record category", () => {
    for (const category of RECORD_CATEGORIES) {
      expect(CATEGORY_ICON[category]).toBeTruthy();
    }
  });
});

describe("CATEGORY_TONE", () => {
  it("has a tone class for every record category", () => {
    for (const category of RECORD_CATEGORIES) {
      expect(typeof CATEGORY_TONE[category]).toBe("string");
      expect(CATEGORY_TONE[category].length).toBeGreaterThan(0);
    }
  });
});

describe("ACTIVITY_ICON", () => {
  it("is defined", () => {
    expect(ACTIVITY_ICON).toBeTruthy();
  });
});
