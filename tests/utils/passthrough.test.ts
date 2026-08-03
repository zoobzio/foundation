// Gold standard: pure utils. No mounting, no harness — call the function and
// assert every logic path (here: merge precedence, deep merge, array
// replacement, function recipes riding through).
import { describe, expect, it } from "vitest";
import { passthrough } from "#foundation/utils/passthrough";

interface Parts {
  root: { size?: number; open?: boolean; nested?: { a?: number; b?: number } };
  item: (n: number) => { id: number };
  list: { tags?: string[] };
}

describe("passthrough", () => {
  it("returns local recipes untouched when no user layer is given", () => {
    const item = (n: number) => ({ id: n });
    const result = passthrough<Parts>(undefined, {
      root: { size: 1 },
      item,
      list: { tags: ["a"] },
    });
    expect(result.root).toEqual({ size: 1 });
    expect(result.item).toBe(item);
    expect(result.list).toEqual({ tags: ["a"] });
  });

  it("user layer wins per key, local fills the rest", () => {
    const result = passthrough<Parts>(
      { root: { size: 2 } },
      { root: { size: 1, open: true }, item: (n) => ({ id: n }), list: {} },
    );
    expect(result.root.size).toBe(2);
    expect(result.root.open).toBe(true);
  });

  it("merges nested objects rather than replacing them", () => {
    const result = passthrough<Parts>(
      { root: { nested: { a: 10 } } },
      { root: { nested: { a: 1, b: 2 } }, item: (n) => ({ id: n }), list: {} },
    );
    expect(result.root.nested).toEqual({ a: 10, b: 2 });
  });

  it("replaces arrays wholesale instead of concatenating", () => {
    const result = passthrough<Parts>(
      { list: { tags: ["x"] } },
      { root: {}, item: (n) => ({ id: n }), list: { tags: ["a", "b"] } },
    );
    expect(result.list.tags).toEqual(["x"]);
  });

  it("function parts stay callable per argument", () => {
    const result = passthrough<Parts>(undefined, {
      root: {},
      item: (n) => ({ id: n * 2 }),
      list: {},
    });
    expect(result.item(3)).toEqual({ id: 6 });
  });
});
