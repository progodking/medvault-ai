import { NextResponse } from "next/server";
import type { z } from "zod";

import { parseJsonBody } from "@/lib/http";
import { logAudit } from "@/lib/store";
import { validateBody } from "@/lib/validation";

/**
 * Shared helpers for the in-memory collection API routes. They centralise the
 * find / merge / filter / audit boilerplate that every resource route repeats,
 * operating in place on the arrays returned by `db()`.
 */
export interface Identifiable {
  id: string;
}

type AuditInfo = { action: string; target: string };

/**
 * Reads an optional `?memberId=` filter from the request and returns the
 * matching items, optionally sorted.
 */
export function queryByMember<T extends { memberId: string }>(
  collection: T[],
  req: Request,
  sort?: (a: T, b: T) => number,
): T[] {
  const memberId = new URL(req.url).searchParams.get("memberId");
  const items = memberId
    ? collection.filter((item) => item.memberId === memberId)
    : collection;
  return sort ? [...items].sort(sort) : items;
}

/** Appends an item, writes an optional audit entry and returns a 201 response. */
export function addItem<T extends Identifiable>(
  collection: T[],
  item: T,
  audit?: AuditInfo,
): NextResponse {
  collection.push(item);
  if (audit) logAudit(audit.action, audit.target);
  return NextResponse.json(item, { status: 201 });
}

/**
 * Merges the JSON request body into the item with the given id (keeping the id
 * stable) and returns it, or a 404 response when it does not exist.
 */
export async function updateItem<T extends Identifiable>(
  collection: T[],
  id: string,
  req: Request,
  onUpdated?: (item: T) => void,
  schema?: z.ZodType,
): Promise<NextResponse> {
  const item = collection.find((entry) => entry.id === id);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const raw = await parseJsonBody<unknown>(req);
  const body = schema ? validateBody(schema, raw) : (raw as Partial<T>);
  Object.assign(item, body, { id });
  onUpdated?.(item);
  return NextResponse.json(item);
}

/** Removes the item with the given id in place and returns `{ ok: true }`. */
export function deleteItem<T extends Identifiable>(
  collection: T[],
  id: string,
  onDeleted?: (item: T) => void,
): NextResponse {
  const idx = collection.findIndex((entry) => entry.id === id);
  if (idx !== -1) {
    const [removed] = collection.splice(idx, 1);
    onDeleted?.(removed);
  }
  return NextResponse.json({ ok: true });
}
