import { NextResponse } from "next/server";

/**
 * An error carrying an explicit HTTP status. Throw it from a route handler to
 * return a structured JSON error instead of an opaque 500.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Parse a JSON request body, throwing a 400 `ApiError` when the body is missing
 * or malformed instead of letting the raw `SyntaxError` bubble up as a 500.
 */
export async function parseJsonBody<T>(req: Request): Promise<T> {
  try {
    return (await req.json()) as T;
  } catch {
    throw new ApiError(400, "Invalid or malformed JSON body");
  }
}

/**
 * Wrap a route handler so thrown errors become structured JSON responses.
 * `ApiError` maps to its declared status; anything unexpected is logged and
 * returned as a 500 so failures are never silently swallowed by the runtime.
 */
export function withErrorHandling<Args extends unknown[]>(
  handler: (req: Request, ...args: Args) => Promise<Response>,
): (req: Request, ...args: Args) => Promise<Response> {
  return async (req: Request, ...args: Args): Promise<Response> => {
    try {
      return await handler(req, ...args);
    } catch (err) {
      if (err instanceof ApiError) {
        return NextResponse.json(
          { error: err.message },
          { status: err.status },
        );
      }
      console.error("Unhandled API route error:", err);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  };
}
