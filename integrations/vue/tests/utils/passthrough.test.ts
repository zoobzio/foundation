import { describe, expect, it } from "vitest";
import { layer, passthrough } from "../../src/utils/passthrough";

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

describe("passthrough function parts", () => {
  it("merges the user function's result over the local one per argument", () => {
    const result = passthrough<Parts>(
      { item: () => ({ id: 0 }) },
      { root: {}, item: (n) => ({ id: n }), list: {} },
    );
    expect(result.item(3)).toEqual({ id: 0 });
  });

  it("keeps local keys the user function leaves out", () => {
    interface Iter {
      item: (n: number) => {
        id: number;
        label?: string;
        nested?: { a?: number; b?: number };
      };
    }
    const result = passthrough<Iter>(
      { item: (n) => ({ label: `#${n}`, nested: { a: 10 } }) },
      { item: (n) => ({ id: n, nested: { a: 1, b: 2 } }) },
    );
    expect(result.item(4)).toEqual({
      id: 4,
      label: "#4",
      nested: { a: 10, b: 2 },
    });
  });

  it("passes the same argument to both functions", () => {
    const seen: number[] = [];
    const result = passthrough<Parts>(
      {
        item: (n) => {
          seen.push(n);
          return {};
        },
      },
      {
        root: {},
        item: (n) => {
          seen.push(n);
          return { id: n };
        },
        list: {},
      },
    );
    result.item(7);
    expect(seen).toEqual([7, 7]);
  });
});

describe("passthrough listeners", () => {
  it("replaces a listener inside a static part instead of composing", () => {
    interface Static {
      root: { onClick?: () => string };
    }
    const result = passthrough<Static>(
      { root: { onClick: () => "user" } },
      { root: { onClick: () => "local" } },
    );
    expect(result.root.onClick?.()).toBe("user");
  });

  it("replaces a listener inside a function part's result", () => {
    interface Iter {
      item: (n: number) => { id: number; onSelect?: () => string };
    }
    const result = passthrough<Iter>(
      { item: () => ({ onSelect: () => "user" }) },
      { item: (n) => ({ id: n, onSelect: () => "local" }) },
    );
    const part = result.item(1);
    expect(part.id).toBe(1);
    expect(part.onSelect?.()).toBe("user");
  });
});

describe("layer", () => {
  type Parts = {
    link: (item: { id: string }) => { as?: string; class?: string };
    root: { class?: string };
  };

  it("serves the wrapper's layer when no user layer is given", () => {
    const out = layer<Parts>(undefined, { link: () => ({ as: "span" }) });
    expect(out.link?.({ id: "a" })).toEqual({ as: "span" });
  });

  it("composes a user function part over the wrapper's", () => {
    const out = layer<Parts>(
      { link: () => ({ class: "x" }) },
      { link: () => ({ as: "span" }) },
    );
    expect(out.link?.({ id: "a" })).toEqual({ as: "span", class: "x" });
  });

  it("lets the user replace the wrapper's key", () => {
    const out = layer<Parts>(
      { link: () => ({ as: "a" }) },
      { link: () => ({ as: "span" }) },
    );
    expect(out.link?.({ id: "a" })).toEqual({ as: "a" });
  });

  it("keeps the user's other parts and leaves both inputs intact", () => {
    const user = { root: { class: "r" } };
    const local = { link: () => ({ as: "span" }) };
    const out = layer<Parts>(user, local);
    expect(out.root).toEqual({ class: "r" });
    expect(out.link?.({ id: "a" })).toEqual({ as: "span" });
    expect(user).toEqual({ root: { class: "r" } });
    expect(Object.keys(local)).toEqual(["link"]);
  });
});

// A component under `as` is an object (a compiled SFC, a `defineComponent`
// result) and must replace the local one rather than merge into it.
describe("passthrough `as`", () => {
  const Local = {
    name: "Local",
    props: { a: String },
    setup: () => () => null,
  };
  const Mine = { name: "Mine", setup: () => () => null };

  it("replaces the local component under `as` in a static part", () => {
    const out = passthrough<{ part: { as: object; x?: number } }>(
      { part: { as: Mine } },
      { part: { as: Local, x: 1 } },
    );
    expect(out.part.as).toBe(Mine);
    expect(out.part.x).toBe(1);
  });

  it("replaces it in a function part's result too", () => {
    const out = passthrough<{ part: (n: number) => { as: object; x: number } }>(
      { part: () => ({ as: Mine }) },
      { part: (n) => ({ as: Local, x: n }) },
    );
    expect(out.part(2)).toEqual({ as: Mine, x: 2 });
  });

  it("keeps the local component when the user's `as` is undefined", () => {
    const out = passthrough<{ part: { as: object } }>(
      { part: { as: undefined } },
      { part: { as: Local } },
    );
    expect(out.part.as).toBe(Local);
  });
});
