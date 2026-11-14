import { describe, expect, it } from "vitest";
import { merge, overrides, patch } from "../src/patch";

const target = () => ({
  title: "Standup",
  locations: { a: { name: "Room 101" } },
  tags: ["x", "y"],
});

describe("patch", () => {
  it("sets, adds and removes properties on a copy", () => {
    const before = target();
    const after = patch(before, {
      title: "Sync",
      "locations/a/name": "Room 202",
      "locations/b": { name: "Lobby" },
      tags: null,
    });
    expect(after).toEqual({
      title: "Sync",
      locations: { a: { name: "Room 202" }, b: { name: "Lobby" } },
    });
    expect(before).toEqual(target());
  });

  it("replaces an array member that exists", () => {
    expect(patch(target(), { "tags/1": "z" }).tags).toEqual(["x", "z"]);
  });

  it("refuses to insert or remove an array member", () => {
    expect(() => patch(target(), { "tags/2": "z" })).toThrow("not a member");
    expect(() => patch(target(), { "tags/-": "z" })).toThrow("not a member");
    expect(() => patch(target(), { "tags/0": null })).toThrow("not a member");
  });

  it("refuses a pointer whose parent is not there", () => {
    expect(() => patch(target(), { "locations/c/name": "x" })).toThrow(
      "has no parent",
    );
  });

  it("refuses two pointers where one leads through the other", () => {
    expect(() =>
      patch(target(), { locations: {}, "locations/a/name": "x" }),
    ).toThrow("overlaps");
  });

  it("unescapes a pointer's tokens", () => {
    expect(patch({ "a/b": { "c~d": 1 } }, { "a~1b/c~0d": 2 })).toEqual({
      "a/b": { "c~d": 2 },
    });
  });
});

describe("overrides", () => {
  it("admits changes to an occurrence", () => {
    expect(overrides({ title: "x", start: "2026-03-03T10:00:00" })).toBe(true);
    expect(overrides({ "participants/p1/name": "x" })).toBe(true);
  });

  it("admits an exclusion alone", () => {
    expect(overrides({ excluded: true })).toBe(true);
    expect(overrides({ excluded: true, title: "x" })).toBe(false);
    expect(overrides({ excluded: false })).toBe(false);
  });

  it("refuses the entry's identity and its recurrence", () => {
    expect(overrides({ uid: "x" })).toBe(false);
    expect(overrides({ "participants/p1/calendarAddress": "x" })).toBe(false);
    expect(overrides({ recurrenceRule: null })).toBe(false);
    expect(overrides({ "recurrenceRule/count": 2 })).toBe(false);
    expect(overrides({ "recurrenceOverrides/x": {} })).toBe(false);
  });
});

describe("merge", () => {
  it("replaces an earlier pointer the later one equals or leads through", () => {
    expect(
      merge(
        { title: "a", "locations/a/name": "x" },
        { title: "b", locations: {} },
      ),
    ).toEqual({ title: "b", locations: {} });
  });

  it("applies a later pointer inside an earlier value", () => {
    expect(
      merge({ locations: { a: { name: "x" } } }, { "locations/a/name": "y" }),
    ).toEqual({ locations: { a: { name: "y" } } });
  });
});
