import { describe, expect, it, vi } from "vitest";

import { ApiError, parseJsonBody, withErrorHandling } from "./http";

function jsonRequest(body: string): Request {
  return new Request("http://localhost/api/test", {
    method: "POST",
    body,
  });
}

describe("ApiError", () => {
  it("carries the status and message", () => {
    const err = new ApiError(404, "Not found");
    expect(err.status).toBe(404);
    expect(err.message).toBe("Not found");
  });

  it("is an Error with the ApiError name", () => {
    const err = new ApiError(400, "Bad");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("ApiError");
  });
});

describe("parseJsonBody", () => {
  it("parses a valid JSON body", async () => {
    const req = jsonRequest(JSON.stringify({ hello: "world" }));
    await expect(parseJsonBody<{ hello: string }>(req)).resolves.toEqual({
      hello: "world",
    });
  });

  it("throws a 400 ApiError for malformed JSON", async () => {
    const req = jsonRequest("{not json");
    await expect(parseJsonBody(req)).rejects.toBeInstanceOf(ApiError);
    await expect(parseJsonBody(jsonRequest("{not json"))).rejects.toMatchObject(
      { status: 400 },
    );
  });

  it("throws a 400 ApiError for an empty body", async () => {
    const req = new Request("http://localhost/api/test", { method: "POST" });
    await expect(parseJsonBody(req)).rejects.toMatchObject({ status: 400 });
  });
});

describe("withErrorHandling", () => {
  it("returns the handler response when nothing throws", async () => {
    const handler = withErrorHandling(async () => new Response("ok"));
    const res = await handler(jsonRequest("{}"));
    expect(await res.text()).toBe("ok");
  });

  it("passes extra args through to the handler", async () => {
    const handler = withErrorHandling(
      async (_req: Request, ctx: { id: string }) =>
        Response.json({ id: ctx.id }),
    );
    const res = await handler(jsonRequest("{}"), { id: "42" });
    expect(await res.json()).toEqual({ id: "42" });
  });

  it("maps a thrown ApiError to its declared status", async () => {
    const handler = withErrorHandling(async () => {
      throw new ApiError(403, "Forbidden");
    });
    const res = await handler(jsonRequest("{}"));
    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ error: "Forbidden" });
  });

  it("maps an unexpected error to a logged 500", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    const handler = withErrorHandling(async () => {
      throw new Error("boom");
    });
    const res = await handler(jsonRequest("{}"));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: "Internal server error" });
    expect(spy).toHaveBeenCalledOnce();
    spy.mockRestore();
  });
});
