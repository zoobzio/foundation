import { describe, expect, it } from "vitest";
import { envelope, same } from "../src/util";

describe("same", () => {
  it("compares objects by their members in any order", () => {
    expect(same({ a: 1, b: [1, 2] }, { b: [1, 2], a: 1 })).toBe(true);
    expect(same({ a: 1 }, { a: 2 })).toBe(false);
    expect(same({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it("reads an undefined member as an absent one", () => {
    expect(same({ a: 1, b: undefined }, { a: 1 })).toBe(true);
  });

  it("compares arrays in order", () => {
    expect(same([1, 2], [2, 1])).toBe(false);
    expect(same([{ a: 1 }], [{ a: 1 }])).toBe(true);
    expect(same([1], [1, 2])).toBe(false);
  });

  it("tells an array from an object and a value from null", () => {
    expect(same([], {})).toBe(false);
    expect(same(null, {})).toBe(false);
    expect(same(null, null)).toBe(true);
    expect(same("a", "a")).toBe(true);
  });
});

describe("envelope", () => {
  it("reads a record with an id and a name", () => {
    expect(envelope({ id: "a", name: "A", payload: 1 })).toEqual({
      id: "a",
      name: "A",
      payload: 1,
      origin: "user",
    });
    expect(envelope({ id: "a", name: "A", origin: "system" })?.origin).toBe(
      "system",
    );
  });

  it("rejects anything else", () => {
    expect(envelope(null)).toBeUndefined();
    expect(envelope([])).toBeUndefined();
    expect(envelope({ id: 1, name: "A" })).toBeUndefined();
    expect(envelope({ id: "a" })).toBeUndefined();
  });
});
