import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "./api-client";

function mockFetch(response: Partial<Response> & { json?: () => Promise<unknown> }) {
  const fn = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({}),
    ...response,
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

describe("api client", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("get parses the JSON response", async () => {
    mockFetch({ json: async () => ({ id: "1" }) });
    await expect(api.get<{ id: string }>("/api/x")).resolves.toEqual({
      id: "1",
    });
  });

  it("get sends the JSON content-type header", async () => {
    const fetchFn = mockFetch({ json: async () => ({}) });
    await api.get("/api/x");
    expect(fetchFn).toHaveBeenCalledWith(
      "/api/x",
      expect.objectContaining({
        headers: { "Content-Type": "application/json" },
      }),
    );
  });

  it("post serializes the body and uses the POST method", async () => {
    const fetchFn = mockFetch({ json: async () => ({ ok: true }) });
    await api.post("/api/x", { a: 1 });
    expect(fetchFn).toHaveBeenCalledWith(
      "/api/x",
      expect.objectContaining({ method: "POST", body: JSON.stringify({ a: 1 }) }),
    );
  });

  it("put serializes the body and uses the PUT method", async () => {
    const fetchFn = mockFetch({ json: async () => ({}) });
    await api.put("/api/x", { a: 2 });
    expect(fetchFn).toHaveBeenCalledWith(
      "/api/x",
      expect.objectContaining({ method: "PUT", body: JSON.stringify({ a: 2 }) }),
    );
  });

  it("del uses the DELETE method", async () => {
    const fetchFn = mockFetch({ json: async () => ({ ok: true }) });
    await api.del("/api/x");
    expect(fetchFn).toHaveBeenCalledWith(
      "/api/x",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("throws the server-provided error message on a non-ok response", async () => {
    mockFetch({ ok: false, status: 422, json: async () => ({ error: "Bad input" }) });
    await expect(api.get("/api/x")).rejects.toThrow("Bad input");
  });

  it("falls back to a status message when the error body has no message", async () => {
    mockFetch({ ok: false, status: 500, json: async () => ({}) });
    await expect(api.get("/api/x")).rejects.toThrow("Request failed: 500");
  });

  it("falls back to a status message when the error body is not JSON", async () => {
    mockFetch({
      ok: false,
      status: 503,
      json: async () => {
        throw new Error("not json");
      },
    });
    await expect(api.get("/api/x")).rejects.toThrow("Request failed: 503");
  });
});
