import { describe, expect, it } from "vitest";

import { errorMessage } from "./errors";

describe("errorMessage", () => {
  it("returns the message of an Error", () => {
    expect(errorMessage(new Error("boom"), "fallback")).toBe("boom");
  });

  it("returns a non-empty string value as-is", () => {
    expect(errorMessage("something failed", "fallback")).toBe(
      "something failed",
    );
  });

  it("falls back for an Error without a message", () => {
    expect(errorMessage(new Error(""), "fallback")).toBe("fallback");
  });

  it("falls back for an empty string", () => {
    expect(errorMessage("", "fallback")).toBe("fallback");
  });

  it("falls back for null, undefined and non-string values", () => {
    expect(errorMessage(null, "fallback")).toBe("fallback");
    expect(errorMessage(undefined, "fallback")).toBe("fallback");
    expect(errorMessage({ message: "nope" }, "fallback")).toBe("fallback");
    expect(errorMessage(42, "fallback")).toBe("fallback");
  });
});
