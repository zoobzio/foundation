import { describe, it, expect } from "vitest";
import { Keywords } from "#foundation/utils/keywords";
const { parse, quote, build } = Keywords;

describe("parse", () => {
  it("returns empty arrays for empty string", () => {
    expect(parse("")).toEqual({ include: [], exclude: [] });
  });

  it("returns empty arrays for whitespace-only string", () => {
    expect(parse("   ")).toEqual({ include: [], exclude: [] });
  });

  it("parses include terms", () => {
    expect(parse("+foo +bar")).toEqual({ include: ["foo", "bar"], exclude: [] });
  });

  it("parses exclude terms", () => {
    expect(parse("-foo -bar")).toEqual({ include: [], exclude: ["foo", "bar"] });
  });

  it("parses mixed include and exclude", () => {
    expect(parse("+foo -bar +baz")).toEqual({ include: ["foo", "baz"], exclude: ["bar"] });
  });

  it("parses quoted phrases", () => {
    expect(parse('+"hello world" -"no thanks"')).toEqual({
      include: ["hello world"],
      exclude: ["no thanks"],
    });
  });

  it("handles OR separator (||)", () => {
    expect(parse("+foo || +bar")).toEqual({ include: ["foo", "bar"], exclude: [] });
  });

  it("skips terms without prefix", () => {
    expect(parse("foo +bar")).toEqual({ include: ["bar"], exclude: [] });
  });

});

describe("quote", () => {
  it("returns term as-is when no spaces", () => {
    expect(quote("foo")).toBe("foo");
  });

  it("wraps term in quotes when it contains spaces", () => {
    expect(quote("hello world")).toBe('"hello world"');
  });
});

describe("build", () => {
  it("builds AND mode string", () => {
    expect(build(["foo", "bar"], [], "and")).toBe("+foo +bar");
  });

  it("builds OR mode string", () => {
    expect(build(["foo", "bar"], [], "or")).toBe("+foo || +bar");
  });

  it("builds string with excludes", () => {
    expect(build(["foo"], ["bar", "baz"], "and")).toBe("+foo -bar -baz");
  });

  it("quotes multi-word terms", () => {
    expect(build(["hello world"], ["no thanks"], "and")).toBe('+"hello world" -"no thanks"');
  });

  it("returns empty string for empty arrays", () => {
    expect(build([], [], "and")).toBe("");
  });

  it("handles exclude-only", () => {
    expect(build([], ["foo"], "and")).toBe("-foo");
  });
});
