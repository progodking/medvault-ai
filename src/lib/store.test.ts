import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  createShareLink,
  db,
  logAudit,
  resolveShareLink,
  uid,
} from "./store";

const g = globalThis as unknown as { __medvaultDb?: unknown };

describe("uid", () => {
  it("prefixes the id with the given string", () => {
    expect(uid("m")).toMatch(/^m_[a-z0-9]+$/);
  });

  it("generates distinct ids", () => {
    expect(uid("m")).not.toBe(uid("m"));
  });
});

describe("db", () => {
  beforeEach(() => {
    delete g.__medvaultDb;
  });

  afterEach(() => {
    delete g.__medvaultDb;
  });

  it("seeds all collections on first access", () => {
    const store = db();
    expect(store.members.length).toBeGreaterThan(0);
    expect(store.records.length).toBeGreaterThan(0);
    expect(store.medicines.length).toBeGreaterThan(0);
    expect(store.reminders.length).toBeGreaterThan(0);
    expect(store.emergency.length).toBeGreaterThan(0);
    expect(store.storage).toHaveProperty("usedMb");
  });

  it("returns the same singleton instance across calls", () => {
    expect(db()).toBe(db());
  });

  it("persists mutations within the process lifetime", () => {
    const before = db().members.length;
    db().members.push({ ...db().members[0], id: uid("m") });
    expect(db().members.length).toBe(before + 1);
  });

  it("re-seeds with fresh data after the store is reset", () => {
    db().members.length = 0;
    delete g.__medvaultDb;
    expect(db().members.length).toBeGreaterThan(0);
  });
});

describe("share links", () => {
  beforeEach(() => {
    delete g.__medvaultDb;
  });

  afterEach(() => {
    delete g.__medvaultDb;
  });

  it("mints an unguessable token for a member", () => {
    const memberId = db().members[0].id;
    const link = createShareLink(memberId);
    expect(link.memberId).toBe(memberId);
    expect(link.token).toMatch(/^[a-f0-9]{48}$/);
    expect(new Date(link.expiresAt).getTime()).toBeGreaterThan(Date.now());
  });

  it("reuses a still-valid token for the same member", () => {
    const memberId = db().members[0].id;
    expect(createShareLink(memberId).token).toBe(
      createShareLink(memberId).token,
    );
  });

  it("resolves a valid token back to its link", () => {
    const memberId = db().members[0].id;
    const { token } = createShareLink(memberId);
    expect(resolveShareLink(token)?.memberId).toBe(memberId);
  });

  it("returns null for unknown tokens", () => {
    expect(resolveShareLink("does-not-exist")).toBeNull();
  });

  it("returns null for expired tokens", () => {
    const memberId = db().members[0].id;
    const link = createShareLink(memberId);
    link.expiresAt = new Date(Date.now() - 1000).toISOString();
    expect(resolveShareLink(link.token)).toBeNull();
  });
});

describe("logAudit", () => {
  beforeEach(() => {
    delete g.__medvaultDb;
  });

  afterEach(() => {
    delete g.__medvaultDb;
  });

  it("prepends a new audit entry with the action and target", () => {
    logAudit("record.create", "Blood Test");
    const [entry] = db().audit;
    expect(entry.action).toBe("record.create");
    expect(entry.target).toBe("Blood Test");
    expect(entry.id).toMatch(/^a_/);
    expect(entry.actor).toBe("aarav@medvault.ai");
    expect(() => new Date(entry.timestamp).toISOString()).not.toThrow();
  });

  it("keeps the most recent entry first", () => {
    logAudit("first.action", "A");
    logAudit("second.action", "B");
    expect(db().audit[0].action).toBe("second.action");
  });
});
