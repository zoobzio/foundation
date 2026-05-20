import { describe, it, expect } from "vitest";
import { isCacheFresh } from "../runtime/session";
import type { AuthUser } from "../src/types";

const fakeUser: AuthUser = { id: "1" };

describe("isCacheFresh", () => {
  it("returns false when ttl is 0 (caching disabled)", () => {
    expect(isCacheFresh({ user: fakeUser, cachedAt: Date.now() }, 0)).toBe(false);
  });

  it("returns false when no cachedAt timestamp", () => {
    expect(isCacheFresh({ user: fakeUser }, 300000)).toBe(false);
  });

  it("returns true when within TTL", () => {
    expect(isCacheFresh({ user: fakeUser, cachedAt: Date.now() - 60000 }, 300000)).toBe(true);
  });

  it("returns false when past TTL", () => {
    expect(isCacheFresh({ user: fakeUser, cachedAt: Date.now() - 600000 }, 300000)).toBe(false);
  });

  it("returns false when exactly at TTL boundary", () => {
    const now = Date.now();
    expect(isCacheFresh({ user: fakeUser, cachedAt: now - 300000 }, 300000)).toBe(false);
  });
});
