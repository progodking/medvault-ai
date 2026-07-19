import { describe, expect, it } from "vitest";

import { ApiError } from "./http";
import {
  medicineInputSchema,
  memberInputSchema,
  recordInputSchema,
  validate,
} from "./validation";

describe("validate", () => {
  it("strips unknown keys to prevent mass assignment", () => {
    const out = validate(memberInputSchema, {
      name: "Riya",
      id: "attacker-controlled",
      createdAt: "1999-01-01",
      isAdmin: true,
    });
    expect(out.name).toBe("Riya");
    expect(out).not.toHaveProperty("id");
    expect(out).not.toHaveProperty("createdAt");
    expect(out).not.toHaveProperty("isAdmin");
  });

  it("rejects invalid enum values with a 400 ApiError", () => {
    expect(() =>
      validate(memberInputSchema, { bloodGroup: "Z+" }),
    ).toThrowError(ApiError);
    try {
      validate(recordInputSchema, { category: "Malware" });
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(400);
    }
  });

  it("rejects wrong types", () => {
    expect(() =>
      validate(medicineInputSchema, { reminderEnabled: "yes" }),
    ).toThrowError(ApiError);
    expect(() =>
      validate(memberInputSchema, { conditions: "diabetes" }),
    ).toThrowError(ApiError);
  });

  it("enforces string length limits", () => {
    expect(() =>
      validate(memberInputSchema, { name: "x".repeat(5000) }),
    ).toThrowError(ApiError);
  });

  it("accepts well-formed partial input", () => {
    const out = validate(recordInputSchema, {
      title: "Blood test",
      category: "Report",
      tags: ["report", "2024"],
    });
    expect(out).toEqual({
      title: "Blood test",
      category: "Report",
      tags: ["report", "2024"],
    });
  });
});
