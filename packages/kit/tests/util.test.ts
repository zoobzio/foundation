import { describe, expect, it, vi } from "vitest";
import { change, compose } from "../src/util";

type Shape = { page: number; query: string };

describe("change", () => {
  it("builds the change object of a field", () => {
    expect(change<Shape, "page">("page", 1, 2)).toEqual({
      field: "page",
      before: 1,
      after: 2,
    });
  });
});

type Context = { tag: string };
const context: Context = { tag: "ctx" };

describe("compose", () => {
  it("runs the steps in order, each with the context", () => {
    const a = vi.fn((value: number) => String(value));
    const b = vi.fn((value: string) => value.length);
    const step = compose<number, string, number, Context>(a, b);
    expect(step(12345, context)).toBe(5);
    expect(a).toHaveBeenCalledWith(12345, context);
    expect(b).toHaveBeenCalledWith("12345", context);
  });

  it("takes three and four steps", () => {
    const inc = (n: number) => n + 1;
    expect(compose(inc, inc, inc)(0, context)).toBe(3);
    expect(compose(inc, inc, inc, inc)(0, context)).toBe(4);
  });

  it("a step that ignores the context composes", () => {
    const parse = (source: string) => JSON.parse(source) as { n: number };
    const pick = ({ n }: { n: number }) => n;
    expect(compose(parse, pick)('{"n":7}', context)).toBe(7);
  });

  it("a step may read the context", () => {
    const tag = (value: string, ctx: Context) => `${ctx.tag}:${value}`;
    expect(compose(tag, tag)("x", context)).toBe("ctx:ctx:x");
  });
});
