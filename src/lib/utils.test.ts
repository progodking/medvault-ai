import { describe, expect, it } from "vitest";

import { getErrorMessage } from "./utils";

describe("getErrorMessage", () => {
  it("returns the message of an Error instance", () => {
    expect(getErrorMessage(new Error("boom"))).toBe("boom");
  });

  it("returns the default fallback for non-Error values", () => {
    expect(getErrorMessage("nope")).toBe("Please try again.");
    expect(getErrorMessage(undefined)).toBe("Please try again.");
  });

  it("returns a custom fallback when provided", () => {
    expect(getErrorMessage(42, "Custom fallback")).toBe("Custom fallback");
  });
});
