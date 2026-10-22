// Seeding a fresh container: the defined fields of the initial slice land,
// the rest keep their defaults, and the container identity is preserved so
// the store can hand it straight to useState.
import { describe, expect, it } from "vitest";
import { seed } from "../../../app/utils/state";

type Fixture = { page: number; sort: string | null; selected: Set<string> };

const fresh = (): Fixture => ({ page: 1, sort: null, selected: new Set() });

describe("seed", () => {
  it("replaces the defaults the initial slice defines", () => {
    const state = seed(fresh(), { page: 3, selected: new Set(["a"]) });
    expect(state).toEqual({ page: 3, sort: null, selected: new Set(["a"]) });
  });

  it("leaves a default in place for an undefined initial field", () => {
    const state = seed(fresh(), { page: undefined, sort: "name" });
    expect(state).toEqual({ page: 1, sort: "name", selected: new Set() });
  });

  it("returns the container it was given", () => {
    const base = fresh();
    expect(seed(base, { page: 2 })).toBe(base);
    expect(seed(base)).toBe(base);
  });
});
