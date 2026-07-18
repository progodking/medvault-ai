import { describe, expect, it } from "vitest";

import { ApiError } from "./http";
import {
  memberCreateSchema,
  reminderCreateSchema,
  validateBody,
} from "./validation";

describe("validateBody", () => {
  it("returns typed data for a valid body", () => {
    const data = validateBody(memberCreateSchema, {
      name: "Aarav",
      bloodGroup: "O+",
    });
    expect(data.name).toBe("Aarav");
  });

  it("throws a 400 ApiError when required fields are missing", () => {
    expect(() => validateBody(memberCreateSchema, {})).toThrowError(ApiError);
    try {
      validateBody(memberCreateSchema, {});
    } catch (err) {
      expect((err as ApiError).status).toBe(400);
    }
  });

  it("rejects values outside the allowed enum", () => {
    expect(() =>
      validateBody(memberCreateSchema, { name: "X", bloodGroup: "Z+" }),
    ).toThrowError(ApiError);
  });

  it("rejects unexpected value types", () => {
    expect(() =>
      validateBody(reminderCreateSchema, { memberId: 123 }),
    ).toThrowError(ApiError);
  });
});
