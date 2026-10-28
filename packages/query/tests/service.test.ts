// Constructor-injected seams — a plain state container and vi.fn()
// listeners. Every test drives the entries or the draft and asserts the
// new state, the panels, and the events.
import { describe, expect, it, vi } from "vitest";
import { QueryService } from "../src/service";
import { createQueryState } from "../src/state";
import type { Config, Entry } from "../src/types";
import { fakeConfig } from "./data";

const makeService = (config: Config = fakeConfig) => {
  const state = createQueryState();
  const service = new QueryService("search", config, state);
  const changed = vi.fn();
  service.on("changed", changed);
  return { service, state, changed };
};

describe("add", () => {
  it("commits a filter and emits changed", () => {
    const { service, changed } = makeService();
    expect(
      service.add({ kind: "filter", key: "status", value: "Active" }),
    ).toBe(true);
    expect(service.entries).toEqual([
      { kind: "filter", key: "status", value: "Active" },
    ]);
    expect(service.filters).toEqual([{ key: "status", value: "Active" }]);
    expect(changed).toHaveBeenCalledExactlyOnceWith({
      id: "search",
      entries: service.entries,
    });
  });

  it("commits text and exposes it as text", () => {
    const { service } = makeService();
    service.add({ kind: "text", value: "alice" });
    expect(service.text).toBe("alice");
    expect(service.filters).toEqual([]);
  });

  it("replaces a same-identity entry and moves it to the end", () => {
    const { service } = makeService();
    service.add({ kind: "filter", key: "status", value: "quoted" });
    service.add({ kind: "text", value: "alice" });
    service.add({ kind: "filter", key: "name", value: "Alice" });
    service.add({ kind: "filter", key: "status", value: "draft" });
    service.add({ kind: "text", value: "bob" });
    expect(service.entries).toEqual([
      { kind: "filter", key: "name", value: "Alice" },
      { kind: "filter", key: "status", value: "draft" },
      { kind: "text", value: "bob" },
    ]);
  });

  it("keeps distinct operators on one key as a range", () => {
    const { service } = makeService();
    service.add({
      kind: "filter",
      key: "created",
      op: "after",
      value: "2026-01-01",
    });
    service.add({
      kind: "filter",
      key: "created",
      op: "before",
      value: "2026-06-01",
    });
    service.add({
      kind: "filter",
      key: "created",
      op: "after",
      value: "2026-02-01",
    });
    expect(service.filters).toEqual([
      { key: "created", op: "before", value: "2026-06-01" },
      { key: "created", op: "after", value: "2026-02-01" },
    ]);
  });

  it("an entry equal to the last one is a no-op", () => {
    const { service, changed } = makeService();
    service.add({ kind: "text", value: "alice" });
    changed.mockClear();
    expect(service.add({ kind: "text", value: "alice" })).toBe(false);
    expect(changed).not.toHaveBeenCalled();
  });

  it("defaults the operator from the field", () => {
    const { service } = makeService();
    service.add({ kind: "filter", key: "created", value: "2026-02-01" });
    expect(service.filters).toEqual([
      { key: "created", op: "on", value: "2026-02-01" },
    ]);
  });

  it("rejects an operator the field does not accept, or none when it has no default", () => {
    const { service, changed } = makeService();
    expect(
      service.add({ kind: "filter", key: "created", op: "over", value: "x" }),
    ).toBe(false);
    expect(
      service.add({ kind: "filter", key: "name", op: "over", value: "x" }),
    ).toBe(false);
    expect(service.add({ kind: "filter", key: "amount", value: "4" })).toBe(
      false,
    );
    expect(service.entries).toEqual([]);
    expect(changed).not.toHaveBeenCalled();
  });

  it("passes a non-field key through as given", () => {
    const { service } = makeService();
    service.add({ kind: "filter", key: "zzz", op: "whatever", value: "x" });
    expect(service.filters).toEqual([
      { key: "zzz", op: "whatever", value: "x" },
    ]);
  });

  it("rejects empty text, and any text when the config turns it off", () => {
    const { service } = makeService();
    expect(service.add({ kind: "text", value: "" })).toBe(false);
    const off = makeService({ ...fakeConfig, text: false });
    expect(off.service.add({ kind: "text", value: "alice" })).toBe(false);
  });
});

describe("remove and clear", () => {
  it("remove drops exactly the indexed entry", () => {
    const { service, changed } = makeService();
    service.add({ kind: "filter", key: "status", value: "Active" });
    service.add({ kind: "filter", key: "name", value: "Alice" });
    changed.mockClear();
    service.remove(0);
    expect(service.entries).toEqual([
      { kind: "filter", key: "name", value: "Alice" },
    ]);
    expect(changed).toHaveBeenCalledOnce();
    service.remove(5);
    service.remove(-1);
    expect(changed).toHaveBeenCalledOnce();
  });

  it("clear empties the entries once", () => {
    const { service, changed } = makeService();
    service.clear();
    expect(changed).not.toHaveBeenCalled();
    service.add({ kind: "text", value: "alice" });
    service.clear();
    expect(service.entries).toEqual([]);
    expect(changed).toHaveBeenCalledTimes(2);
  });
});

describe("parse", () => {
  it("returns the field stage when no label prefix matches", () => {
    const { service } = makeService();
    service.setDraft("na");
    expect(service.parse).toEqual({ term: "na" });
    expect(service.stage).toBe("field");
    service.setDraft("Ghost: x");
    expect(service.parse).toEqual({ term: "Ghost: x" });
  });

  it("matches a label case-insensitively and trims the term", () => {
    const { service } = makeService();
    service.setDraft("status:  act");
    expect(service.parse).toMatchObject({ key: "status", term: "act" });
    expect(service.stage).toBe("value");
  });

  it("parses an operator for operator fields only", () => {
    const { service } = makeService();
    service.setDraft("Amount: over: 4");
    expect(service.parse).toMatchObject({
      key: "amount",
      op: "over",
      term: "4",
    });
    expect(service.stage).toBe("value");
    service.setDraft("Amount: ");
    expect(service.stage).toBe("op");
    service.setDraft("Status: over: 4");
    expect(service.parse).toMatchObject({ key: "status", term: "over: 4" });
  });
});

describe("panels", () => {
  it("lists fields, then operators, then values", () => {
    const { service } = makeService();
    expect(service.items.map((o) => o.value)).toEqual([
      "id",
      "name",
      "status",
      "created",
      "amount",
    ]);
    service.setDraft("na");
    expect(service.items).toEqual([
      { stage: "field", value: "name", label: "Name" },
    ]);
    service.setDraft("Amount: o");
    expect(service.items.map((o) => o.value)).toEqual(["over"]);
    service.setDraft("Status: inac");
    expect(service.items).toEqual([
      { stage: "value", value: "Inactive", label: "Inactive" },
    ]);
    service.setDraft("Name: x");
    expect(service.items).toEqual([]);
  });

  it("asks a values provider for the term, and takes its result as is", () => {
    const values = vi.fn((term: string) =>
      term ? [`${term}@zoobz.io`, `${term}@example.com`] : [],
    );
    const { service } = makeService({
      fields: { email: { label: "Email", values } },
    });
    service.setDraft("Email: ");
    expect(service.items).toEqual([]);
    expect(values).toHaveBeenLastCalledWith("");
    service.setDraft("Email: alice");
    expect(service.items).toEqual([
      { stage: "value", value: "alice@zoobz.io", label: "alice@zoobz.io" },
      {
        stage: "value",
        value: "alice@example.com",
        label: "alice@example.com",
      },
    ]);
    expect(values).toHaveBeenLastCalledWith("alice");
    expect(service.hint).toBe("@zoobz.io");
  });

  it("builds the trail from the path taken, and the panels from the trail plus the items", () => {
    const { service } = makeService();
    expect(service.trail).toEqual([]);
    expect(service.panels).toEqual([service.items]);
    service.setDraft("Amount: over: 4");
    expect(service.trail).toEqual([
      [{ stage: "field", value: "amount", label: "Amount", active: true }],
      [{ stage: "op", value: "over", label: "over", active: true }],
    ]);
    expect(service.panels).toEqual(service.trail);
    service.setDraft("Status: ");
    expect(service.panels).toEqual([...service.trail, service.items]);
  });

  it("completes from the panel, with a colon for field and operator", () => {
    const { service } = makeService();
    const at = (text: string) => {
      service.setDraft(text);
      return service.hint;
    };
    expect(at("na")).toBe("me: ");
    expect(at("Amount: ov")).toBe("er: ");
    expect(at("Status: inac")).toBe("tive");
    expect(at("Status: Active")).toBe("");
    expect(at("")).toBe("");
  });
});

describe("select", () => {
  it("enters a field's stage, and steps back out of an active one", () => {
    const { service } = makeService();
    service.select({ stage: "field", value: "amount", label: "Amount" });
    expect(service.draft).toBe("Amount: ");
    service.select({
      stage: "field",
      value: "amount",
      label: "Amount",
      active: true,
    });
    expect(service.draft).toBe("");
  });

  it("enters an operator's stage, and steps back out of an active one", () => {
    const { service } = makeService();
    service.setDraft("Amount: ");
    service.select({ stage: "op", value: "over", label: "over" });
    expect(service.draft).toBe("Amount: over: ");
    service.select({ stage: "op", value: "over", label: "over", active: true });
    expect(service.draft).toBe("Amount: ");
  });

  it("ignores an operator option with no field", () => {
    const { service } = makeService();
    service.select({ stage: "op", value: "over", label: "over" });
    expect(service.draft).toBe("");
  });

  it("commits a value with the field and operator, then clears", () => {
    const { service, changed } = makeService();
    service.setDraft("Amount: over: 4");
    service.select({ stage: "value", value: "40", label: "40" });
    const entry: Entry = {
      kind: "filter",
      key: "amount",
      op: "over",
      value: "40",
    };
    expect(service.entries).toEqual([entry]);
    expect(changed).toHaveBeenCalledOnce();
    expect(service.draft).toBe("");
  });

  it("ignores a value option with no field", () => {
    const { service, changed } = makeService();
    service.select({ stage: "value", value: "40", label: "40" });
    expect(changed).not.toHaveBeenCalled();
  });
});

describe("submit", () => {
  it("commits the term as the field's value", () => {
    const { service } = makeService();
    service.setDraft("Status: Active ");
    service.submit();
    expect(service.entries).toEqual([
      { kind: "filter", key: "status", value: "Active" },
    ]);
    expect(service.draft).toBe("");
  });

  it("commits free text as a text entry", () => {
    const { service } = makeService();
    service.setDraft("alice");
    service.submit();
    expect(service.entries).toEqual([{ kind: "text", value: "alice" }]);
  });

  it("ignores an empty term, and free text when text is off", () => {
    const { service, changed } = makeService({ ...fakeConfig, text: false });
    service.setDraft("Status: ");
    service.submit();
    service.setDraft("alice");
    service.submit();
    expect(changed).not.toHaveBeenCalled();
    expect(service.draft).toBe("alice");
  });

  it("keeps the draft when the entry is rejected", () => {
    const { service } = makeService();
    service.setDraft("Amount: 4");
    service.submit();
    expect(service.entries).toEqual([]);
    expect(service.draft).toBe("Amount: 4");
  });
});

describe("unwrap", () => {
  it("takes the last entry back as text minus one character", () => {
    const { service } = makeService();
    service.add({ kind: "text", value: "alice" });
    service.add({ kind: "filter", key: "status", value: "Active" });
    service.unwrap();
    expect(service.entries).toEqual([{ kind: "text", value: "alice" }]);
    expect(service.draft).toBe("Status: Activ");
    service.unwrap();
    expect(service.entries).toEqual([]);
    expect(service.draft).toBe("alic");
    service.unwrap();
    expect(service.draft).toBe("alic");
  });
});

describe("text", () => {
  it("formats stage text, entry text and entry labels", () => {
    const { service } = makeService();
    expect(service.stageText("status")).toBe("Status: ");
    expect(service.stageText("amount", "over")).toBe("Amount: over: ");
    expect(service.stageText("ghost")).toBe("ghost: ");
    const filter: Entry = {
      kind: "filter",
      key: "amount",
      op: "over",
      value: "4",
    };
    expect(service.textFor(filter)).toBe("Amount: over: 4");
    expect(service.labelFor(filter)).toBe("Amount: over 4");
    const text: Entry = { kind: "text", value: "alice" };
    expect(service.textFor(text)).toBe("alice");
    expect(service.labelFor(text)).toBe('"alice"');
  });
});

describe("events", () => {
  it("emits change on a draft write and reset", () => {
    const { service } = makeService();
    const change = vi.fn();
    service.on("change", change);
    service.setDraft("a");
    service.reset();
    expect(change).toHaveBeenCalledTimes(2);
    expect(change).toHaveBeenLastCalledWith({
      field: "draft",
      before: "a",
      after: "",
    });
  });
});
