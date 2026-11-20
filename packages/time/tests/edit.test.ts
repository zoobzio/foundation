// The scoped edits against the format's own semantics: what each scope
// stores, and how a recurring entry is cut in two.
import { describe, expect, it } from "vitest";
import { createEntry, removeEntry, updateEntry } from "../src/edit";
import { expand } from "../src/recur";
import { event, march } from "./data";

const NOW = new Date("2026-03-04T12:00:00Z");

const editing = () => {
  let made = 0;
  return { zone: "UTC", now: NOW, uid: () => `new-${++made}` };
};

const weekly = (rest: Parameters<typeof event>[2] = {}) =>
  event("w", "2026-03-02T09:00:00", {
    title: "Standup",
    recurrenceRule: { frequency: "weekly" },
    ...rest,
  });

const found = (entries: Parameters<typeof expand>[0]) =>
  expand(entries, march, "UTC");

describe("createEntry", () => {
  it("adds the entry and stores it", () => {
    const held = [event("a", "2026-03-02T09:00:00")];
    const entry = event("b", "2026-03-03T09:00:00");
    expect(createEntry(held, entry)).toEqual({
      scope: "all",
      entries: [...held, entry],
      stored: [entry],
      removed: [],
    });
  });
});

describe("updateEntry", () => {
  it("patches an entry that does not recur whole, whatever the scope", () => {
    const entries = [event("a", "2026-03-02T09:00:00")];
    const edit = updateEntry(
      entries,
      found(entries),
      "a",
      { title: "New" },
      "one",
      editing(),
    );
    expect(edit.scope).toBe("all");
    expect(edit.entries[0]).toMatchObject({
      title: "New",
      updated: "2026-03-04T12:00:00Z",
      sequence: 1,
    });
    expect(edit.stored).toEqual(edit.entries);
    expect(entries[0]?.title).toBeUndefined();
  });

  it("writes a patch of one occurrence into the overrides, over the one held", () => {
    const entries = [
      weekly({
        recurrenceOverrides: { "2026-03-09T09:00": { title: "Old" } },
      }),
    ];
    const edit = updateEntry(
      entries,
      found(entries),
      "w#2026-03-09T09:00:00",
      { duration: "PT2H" },
      undefined,
      editing(),
    );
    expect(edit.scope).toBe("one");
    expect(edit.entries[0]?.recurrenceOverrides).toEqual({
      "2026-03-09T09:00": { title: "Old", duration: "PT2H" },
    });
  });

  it("refuses a patch of one occurrence that would change its entry", () => {
    const entries = [weekly()];
    expect(() =>
      updateEntry(
        entries,
        found(entries),
        "w#2026-03-09T09:00:00",
        { uid: "x" },
        "one",
        editing(),
      ),
    ).toThrow("A patch of one occurrence cannot change its entry");
  });

  it("cuts the entry in two for an occurrence and every later one", () => {
    const entries = [
      weekly({
        recurrenceRule: { frequency: "weekly", count: 5 },
        recurrenceOverrides: {
          "2026-03-09T09:00:00": { title: "Early" },
          "2026-03-23T09:00:00": { title: "Late" },
        },
      }),
    ];
    const edit = updateEntry(
      entries,
      found(entries),
      "w#2026-03-16T09:00:00",
      { title: "Later" },
      "following",
      editing(),
    );
    const [head, tail] = edit.entries;
    expect(edit.scope).toBe("following");
    expect(edit.stored).toEqual([head, tail]);
    expect(head).toMatchObject({
      uid: "w",
      title: "Standup",
      recurrenceRule: { frequency: "weekly", until: "2026-03-09T09:00:00" },
      recurrenceOverrides: { "2026-03-09T09:00:00": { title: "Early" } },
      relatedTo: { "new-1": { relation: { next: true } } },
      sequence: 1,
    });
    expect(tail).toMatchObject({
      uid: "new-1",
      title: "Later",
      start: "2026-03-16T09:00:00",
      recurrenceRule: { frequency: "weekly", count: 3 },
      recurrenceOverrides: { "2026-03-23T09:00:00": { title: "Late" } },
      relatedTo: { w: { relation: { first: true } } },
    });
    expect(tail?.sequence).toBeUndefined();
  });

  it("drops the overrides of the entry that follows where its start moves", () => {
    const entries = [
      weekly({
        recurrenceOverrides: { "2026-03-23T09:00:00": { title: "Late" } },
      }),
    ];
    const edit = updateEntry(
      entries,
      found(entries),
      "w#2026-03-16T09:00:00",
      { start: "2026-03-16T10:00:00" },
      "following",
      editing(),
    );
    expect(edit.entries[1]?.recurrenceOverrides).toBeUndefined();
  });

  it("reaches the whole entry from its first occurrence", () => {
    const entries = [weekly()];
    const edit = updateEntry(
      entries,
      found(entries),
      "w#2026-03-02T09:00:00",
      { title: "All" },
      "following",
      editing(),
    );
    expect(edit.scope).toBe("all");
    expect(edit.entries).toHaveLength(1);
  });

  it("throws for a key the expansion does not hold", () => {
    expect(() =>
      updateEntry([], [], "nope", { title: "x" }, undefined, editing()),
    ).toThrow('No occurrence "nope" in the range');
  });
});

describe("removeEntry", () => {
  it("excludes one occurrence", () => {
    const entries = [weekly()];
    const edit = removeEntry(
      entries,
      found(entries),
      "w#2026-03-09T09:00:00",
      undefined,
      editing(),
    );
    expect(edit.scope).toBe("one");
    expect(edit.entries[0]?.recurrenceOverrides).toEqual({
      "2026-03-09T09:00:00": { excluded: true },
    });
    expect(edit.removed).toEqual([]);
  });

  it("ends the rule before an occurrence and every later one", () => {
    const entries = [weekly()];
    const edit = removeEntry(
      entries,
      found(entries),
      "w#2026-03-16T09:00:00",
      "following",
      editing(),
    );
    expect(edit.entries).toHaveLength(1);
    expect(edit.entries[0]?.recurrenceRule?.until).toBe("2026-03-09T09:00:00");
    expect(edit.entries[0]?.relatedTo).toBeUndefined();
  });

  it("removes the whole entry", () => {
    const entries = [weekly(), event("a", "2026-03-02T09:00:00")];
    const edit = removeEntry(
      entries,
      found(entries),
      "w#2026-03-09T09:00:00",
      "all",
      editing(),
    );
    expect(edit.entries.map((e) => e.uid)).toEqual(["a"]);
    expect(edit.stored).toEqual([]);
    expect(edit.removed.map((e) => e.uid)).toEqual(["w"]);
  });
});
