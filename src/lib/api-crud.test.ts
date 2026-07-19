import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  addItem,
  deleteItem,
  queryByMember,
  updateItem,
} from "./api-crud";
import { db } from "./store";

const g = globalThis as unknown as { __medvaultDb?: unknown };

interface Row {
  id: string;
  memberId: string;
  name?: string;
}

function req(url: string, init?: RequestInit): Request {
  return new Request(url, init);
}

describe("queryByMember", () => {
  const items: Row[] = [
    { id: "1", memberId: "m1", name: "a" },
    { id: "2", memberId: "m2", name: "b" },
    { id: "3", memberId: "m1", name: "c" },
  ];

  it("returns all items when no memberId filter is present", () => {
    expect(queryByMember(items, req("http://x/api/records"))).toEqual(items);
  });

  it("filters by the memberId query param", () => {
    const result = queryByMember(items, req("http://x/api/records?memberId=m1"));
    expect(result.map((r) => r.id)).toEqual(["1", "3"]);
  });

  it("returns an empty array when no item matches", () => {
    expect(queryByMember(items, req("http://x/api/records?memberId=zzz"))).toEqual(
      [],
    );
  });

  it("applies the sort comparator without mutating the source", () => {
    const source = [...items];
    const sorted = queryByMember(items, req("http://x/api/records"), (a, b) =>
      (b.name ?? "").localeCompare(a.name ?? ""),
    );
    expect(sorted.map((r) => r.name)).toEqual(["c", "b", "a"]);
    expect(items).toEqual(source);
  });
});

describe("addItem", () => {
  beforeEach(() => delete g.__medvaultDb);
  afterEach(() => delete g.__medvaultDb);

  it("appends the item and responds 201 with the item", async () => {
    const collection: Row[] = [];
    const item: Row = { id: "1", memberId: "m1" };
    const res = addItem(collection, item);
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(item);
    expect(collection).toContain(item);
  });

  it("writes an audit entry when audit info is provided", async () => {
    const before = db().audit.length;
    addItem<Row>([], { id: "1", memberId: "m1" }, {
      action: "record.create",
      target: "Blood Test",
    });
    expect(db().audit.length).toBe(before + 1);
    expect(db().audit[0]).toMatchObject({
      action: "record.create",
      target: "Blood Test",
    });
  });

  it("does not write an audit entry without audit info", () => {
    const before = db().audit.length;
    addItem<Row>([], { id: "1", memberId: "m1" });
    expect(db().audit.length).toBe(before);
  });
});

describe("updateItem", () => {
  it("merges the body while keeping the id stable", async () => {
    const collection: Row[] = [{ id: "1", memberId: "m1", name: "old" }];
    const res = await updateItem(
      collection,
      "1",
      req("http://x", { method: "PUT", body: JSON.stringify({ id: "hacked", name: "new" }) }),
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ id: "1", memberId: "m1", name: "new" });
    expect(collection[0].id).toBe("1");
  });

  it("invokes the onUpdated callback with the updated item", async () => {
    const collection: Row[] = [{ id: "1", memberId: "m1" }];
    let seen: Row | undefined;
    await updateItem(
      collection,
      "1",
      req("http://x", { method: "PUT", body: JSON.stringify({ name: "x" }) }),
      (item) => {
        seen = item;
      },
    );
    expect(seen).toMatchObject({ id: "1", name: "x" });
  });

  it("responds 404 when the item does not exist", async () => {
    const res = await updateItem(
      [],
      "missing",
      req("http://x", { method: "PUT", body: JSON.stringify({ name: "x" }) }),
    );
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Not found" });
  });
});

describe("deleteItem", () => {
  it("removes the matching item and responds ok", async () => {
    const collection: Row[] = [
      { id: "1", memberId: "m1" },
      { id: "2", memberId: "m1" },
    ];
    const res = deleteItem(collection, "1");
    expect(await res.json()).toEqual({ ok: true });
    expect(collection.map((r) => r.id)).toEqual(["2"]);
  });

  it("invokes onDeleted with the removed item", () => {
    const collection: Row[] = [{ id: "1", memberId: "m1" }];
    let removed: Row | undefined;
    deleteItem(collection, "1", (item) => {
      removed = item;
    });
    expect(removed).toEqual({ id: "1", memberId: "m1" });
  });

  it("is a no-op that still responds ok when the id is absent", () => {
    const collection: Row[] = [{ id: "1", memberId: "m1" }];
    let called = false;
    deleteItem(collection, "missing", () => {
      called = true;
    });
    expect(collection).toHaveLength(1);
    expect(called).toBe(false);
  });
});
