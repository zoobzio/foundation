// Constructor-injected seams — a plain state container and vi.fn()
// listeners. Every test drives the entries or the draft and asserts the
// new state, the panels, and the events.
import { afterEach, describe, expect, it, vi } from "vitest";
import { QueryService } from "../src/service";
import { createQueryState } from "../src/state";
import { QUERY_TEXT_LITERAL } from "../src/constants";
import { debounced } from "../src/debounced";
import type { Config, Entry, Lookup, Page } from "../src/types";
import { fakeConfig, NEST, TAG, TWO } from "./data";

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

  it("commits the text literal and exposes it as text", () => {
    const { service } = makeService();
    service.add({ kind: "literal", key: "text", value: "alice" });
    expect(service.text).toBe("alice");
    expect(service.filters).toEqual([]);
  });

  it("replaces a same-identity entry and moves it to the end", () => {
    const { service } = makeService();
    service.add({ kind: "filter", key: "status", value: "quoted" });
    service.add({ kind: "literal", key: "text", value: "alice" });
    service.add({ kind: "filter", key: "name", value: "Alice" });
    service.add({ kind: "filter", key: "status", value: "draft" });
    service.add({ kind: "literal", key: "text", value: "bob" });
    expect(service.entries).toEqual([
      { kind: "filter", key: "name", value: "Alice" },
      { kind: "filter", key: "status", value: "draft" },
      { kind: "literal", key: "text", value: "bob" },
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
    service.add({ kind: "literal", key: "text", value: "alice" });
    changed.mockClear();
    expect(service.add({ kind: "literal", key: "text", value: "alice" })).toBe(
      false,
    );
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

  it("rejects an empty literal, and one whose key is not configured", () => {
    const { service } = makeService();
    expect(service.add({ kind: "literal", key: "text", value: "" })).toBe(
      false,
    );
    expect(service.add({ kind: "literal", key: "tag", value: "x" })).toBe(
      false,
    );
    const off = makeService({ ...fakeConfig, literals: {} });
    expect(
      off.service.add({ kind: "literal", key: "text", value: "alice" }),
    ).toBe(false);
  });

  it("holds one entry per literal key", () => {
    const { service } = makeService({ ...fakeConfig, literals: TWO });
    service.add({ kind: "literal", key: "text", value: "alice" });
    service.add({ kind: "literal", key: "tag", value: "urgent" });
    service.add({ kind: "literal", key: "text", value: "bob" });
    expect(service.entries).toEqual([
      { kind: "literal", key: "tag", value: "urgent" },
      { kind: "literal", key: "text", value: "bob" },
    ]);
    expect(service.text).toBe("bob");
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
    service.add({ kind: "literal", key: "text", value: "alice" });
    service.clear();
    expect(service.entries).toEqual([]);
    expect(changed).toHaveBeenCalledTimes(2);
  });
});

describe("parse", () => {
  it("reads a quoted draft as the text literal, the term within the quotes, with no panels", () => {
    const { service } = makeService();
    service.setDraft('"');
    expect(service.parse).toEqual({
      key: "text",
      literal: QUERY_TEXT_LITERAL,
      term: "",
    });
    expect(service.stage).toBe("literal");
    service.setDraft('"Status: Active');
    expect(service.parse.term).toBe("Status: Active");
    expect(service.items).toEqual([]);
    expect(service.hint).toBe("");
    expect(service.trail).toEqual([]);
    expect(service.panels).toEqual([]);
  });

  it("reads a literal by its own characters, the longest open first", () => {
    const { service, state } = makeService({ ...fakeConfig, literals: TWO });
    service.setDraft("(ur");
    expect(service.parse).toEqual({ key: "tag", literal: TAG, term: "ur" });
    service.setDraft("((ur");
    expect(service.parse).toEqual({ key: "nest", literal: NEST, term: "ur" });
    // Written to the container, as setDraft would commit the closed literal.
    state.draft = "((ur))";
    expect(service.parse.term).toBe("ur");
    state.draft = "(ur)";
    expect(service.parse).toEqual({ key: "tag", literal: TAG, term: "ur" });
  });

  it("reads a quote as a character when no literal opens with it", () => {
    const { service } = makeService({ ...fakeConfig, literals: {} });
    service.setDraft('"na');
    expect(service.parse).toEqual({ term: '"na' });
    expect(service.stage).toBe("field");
    expect(service.trail).toEqual([]);
  });

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
    service.setDraft("Amount: over 4");
    expect(service.parse).toMatchObject({
      key: "amount",
      op: "over",
      term: "4",
    });
    expect(service.stage).toBe("value");
    service.setDraft("Amount: ");
    expect(service.stage).toBe("op");
    service.setDraft("Status: over 4");
    expect(service.parse).toMatchObject({ key: "status", term: "over 4" });
  });

  it("takes an operator once its space is typed, without case", () => {
    const { service } = makeService();
    service.setDraft("Amount: over");
    expect(service.parse).toMatchObject({ key: "amount", term: "over" });
    expect(service.stage).toBe("op");
    service.setDraft("Amount: over ");
    expect(service.parse).toMatchObject({
      key: "amount",
      op: "over",
      term: "",
    });
    expect(service.stage).toBe("value");
    service.setDraft("Amount: OVER 4");
    expect(service.parse).toMatchObject({ op: "over", term: "4" });
    service.setDraft("Amount: overt 4");
    expect(service.parse).toMatchObject({ key: "amount", term: "overt 4" });
    expect(service.stage).toBe("op");
  });

  it("matches the longest operator first", () => {
    const { service } = makeService({
      fields: {
        due: { label: "Due", operators: ["on", "on or before"] },
      },
    });
    service.setDraft("Due: on or before 2026-01-01");
    expect(service.parse).toMatchObject({
      op: "on or before",
      term: "2026-01-01",
    });
    service.setDraft("Due: on 2026-01-01");
    expect(service.parse).toMatchObject({ op: "on", term: "2026-01-01" });
  });
});

describe("panels", () => {
  it("lists the literal options and the fields, then operators, then values", () => {
    const { service } = makeService();
    expect(service.items.map((o) => o.value)).toEqual([
      "text",
      "id",
      "name",
      "status",
      "created",
      "amount",
    ]);
    expect(service.items[0]).toEqual({
      stage: "literal",
      value: "text",
      label: "Search",
    });
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

  it("offers the configured literals while nothing is typed, their other properties carried onto their options", () => {
    const find = { ...QUERY_TEXT_LITERAL, label: "Find", icon: "search" };
    const { service } = makeService({
      ...fakeConfig,
      literals: { text: find, tag: TAG },
    });
    expect(service.items.slice(0, 2)).toEqual([
      { stage: "literal", value: "text", label: "Find", icon: "search" },
      { stage: "literal", value: "tag", label: "Tag" },
    ]);
    service.setDraft(" ");
    expect(service.items[0]?.stage).toBe("literal");
    service.setDraft("s");
    expect(service.items.map((o) => o.value)).toEqual(["status"]);
    const off = makeService({ ...fakeConfig, literals: {} });
    expect(off.service.items.map((o) => o.stage)).not.toContain("literal");
  });

  it("carries a field's other properties onto its option, in the panel and the trail", () => {
    const status = { label: "Status", values: ["Active"], icon: "check" };
    const { service } = makeService({ fields: { status }, literals: {} });
    expect(service.items).toEqual([
      { stage: "field", value: "status", label: "Status", icon: "check" },
    ]);
    service.setDraft("Status: ");
    expect(service.trail).toEqual([
      [
        {
          stage: "field",
          value: "status",
          label: "Status",
          icon: "check",
          active: true,
        },
      ],
    ]);
    expect(service.items).toEqual([
      { stage: "value", value: "Active", label: "Active" },
    ]);
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
    expect(values).toHaveBeenLastCalledWith(
      "",
      expect.objectContaining({ key: "email" }),
    );
    service.setDraft("Email: alice");
    expect(service.items).toEqual([
      { stage: "value", value: "alice@zoobz.io", label: "alice@zoobz.io" },
      {
        stage: "value",
        value: "alice@example.com",
        label: "alice@example.com",
      },
    ]);
    expect(values).toHaveBeenLastCalledWith(
      "alice",
      expect.objectContaining({ key: "email" }),
    );
    expect(service.hint).toBe("@zoobz.io");
  });

  it("builds the trail from the path taken, and the panels from the trail plus the items", () => {
    const { service } = makeService();
    expect(service.trail).toEqual([]);
    expect(service.panels).toEqual([service.items]);
    service.setDraft("Amount: over 4");
    expect(service.trail).toEqual([
      [{ stage: "field", value: "amount", label: "Amount", active: true }],
      [{ stage: "op", value: "over", label: "over", active: true }],
    ]);
    expect(service.panels).toEqual(service.trail);
    service.setDraft("Status: ");
    expect(service.panels).toEqual([...service.trail, service.items]);
  });

  it("completes from the panel: a colon after a field, a space after an operator", () => {
    const { service } = makeService();
    const at = (text: string) => {
      service.setDraft(text);
      return service.hint;
    };
    expect(at("na")).toBe("me: ");
    expect(at("Amount: ov")).toBe("er ");
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
    expect(service.draft).toBe("Amount: over ");
    service.select({ stage: "op", value: "over", label: "over", active: true });
    expect(service.draft).toBe("Amount: ");
  });

  it("ignores an operator option with no field", () => {
    const { service } = makeService();
    service.select({ stage: "op", value: "over", label: "over" });
    expect(service.draft).toBe("");
  });

  it("opens a literal before the term on its option, and not one that is not configured", () => {
    const { service } = makeService();
    const search = service.items[0]!;
    service.select(search);
    expect(service.draft).toBe('"');
    service.setDraft("ro");
    service.select(search);
    expect(service.draft).toBe('"ro');
    const off = makeService({ ...fakeConfig, literals: {} });
    off.service.select(search);
    expect(off.service.draft).toBe("");
  });

  it("commits a value with the field and operator, then clears", () => {
    const { service, changed } = makeService();
    service.setDraft("Amount: over 4");
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

  it("commits a quoted draft as the text literal, closed or not", () => {
    const { service } = makeService();
    service.setDraft('"alice ');
    service.submit();
    expect(service.entries).toEqual([
      { kind: "literal", key: "text", value: "alice" },
    ]);
    expect(service.draft).toBe("");
  });

  it("commits the literal as soon as its close is typed", () => {
    const { service, changed } = makeService();
    service.setDraft('"alice');
    expect(changed).not.toHaveBeenCalled();
    service.setDraft('"alice"');
    expect(service.entries).toEqual([
      { kind: "literal", key: "text", value: "alice" },
    ]);
    expect(changed).toHaveBeenCalledOnce();
    expect(service.draft).toBe("");
    // An empty pair commits nothing and stays as typed.
    service.setDraft('""');
    expect(changed).toHaveBeenCalledOnce();
    expect(service.draft).toBe('""');
    // A literal with its own characters commits on its own close.
    const tags = makeService({ ...fakeConfig, literals: TWO });
    tags.service.setDraft("(urgent");
    expect(tags.service.entries).toEqual([]);
    tags.service.setDraft("(urgent)");
    expect(tags.service.entries).toEqual([
      { kind: "literal", key: "tag", value: "urgent" },
    ]);
    tags.service.setDraft("((a)");
    expect(tags.service.entries).toHaveLength(1);
    tags.service.setDraft("((a))");
    expect(tags.service.entries.at(-1)).toEqual({
      kind: "literal",
      key: "nest",
      value: "a",
    });
  });

  it("ignores a bare term, which names a field still", () => {
    const { service, changed } = makeService();
    service.setDraft("alice");
    service.submit();
    service.setDraft("Status");
    service.submit();
    expect(changed).not.toHaveBeenCalled();
    expect(service.draft).toBe("Status");
  });

  it("ignores an empty term, and quoted text when no literal opens with a quote", () => {
    const { service, changed } = makeService({ ...fakeConfig, literals: {} });
    service.setDraft("Status: ");
    service.submit();
    service.setDraft('"alice"');
    service.submit();
    expect(changed).not.toHaveBeenCalled();
    expect(service.draft).toBe('"alice"');
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
    service.add({ kind: "literal", key: "text", value: "alice" });
    service.add({ kind: "filter", key: "status", value: "Active" });
    service.unwrap();
    expect(service.entries).toEqual([
      { kind: "literal", key: "text", value: "alice" },
    ]);
    expect(service.draft).toBe("Status: Activ");
    service.unwrap();
    expect(service.entries).toEqual([]);
    expect(service.draft).toBe('"alice');
    expect(service.stage).toBe("literal");
    service.unwrap();
    expect(service.draft).toBe('"alice');
  });
});

describe("text", () => {
  it("formats stage text, entry text and entry labels", () => {
    const { service } = makeService();
    expect(service.stageText("status")).toBe("Status: ");
    expect(service.stageText("amount", "over")).toBe("Amount: over ");
    expect(service.stageText("ghost")).toBe("ghost: ");
    const filter: Entry = {
      kind: "filter",
      key: "amount",
      op: "over",
      value: "4",
    };
    expect(service.textFor(filter)).toBe("Amount: over 4");
    expect(service.labelFor(filter)).toBe("Amount: over 4");
    const text: Entry = { kind: "literal", key: "text", value: "alice" };
    expect(service.textFor(text)).toBe('"alice"');
    expect(service.labelFor(text)).toBe('"alice"');
    const ghost: Entry = { kind: "literal", key: "ghost", value: "x" };
    expect(service.textFor(ghost)).toBe("x");
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

/** The value options of a list of values. */
const optionsOf = (values: string[]) =>
  values.map((v) => ({ stage: "value", value: v, label: v }));

/**
 * A provider whose every call waits on the test: `calls` holds the term,
 * the lookup, and the two ways to settle each.
 */
const deferred = () => {
  const calls: {
    term: string;
    lookup: Lookup;
    resolve: (result: readonly string[] | Page) => void;
    reject: (error: unknown) => void;
  }[] = [];
  const values = (term: string, lookup: Lookup) =>
    new Promise<readonly string[] | Page>((resolve, reject) => {
      calls.push({ term, lookup, resolve, reject });
    });
  return { calls, values };
};

/** Lets a settled promise's handlers run. */
const settled = () => new Promise<void>((resolve) => setTimeout(resolve));

describe("values", () => {
  it("asks a provider once per change of the draft, not per read", () => {
    const values = vi.fn((term: string) => [`${term}!`]);
    const { service } = makeService({
      fields: { email: { label: "Email", values } },
    });
    expect(values).not.toHaveBeenCalled();
    service.setDraft("Em");
    expect(values).not.toHaveBeenCalled();
    service.setDraft("Email: a");
    void service.items;
    void service.panels;
    void service.hint;
    expect(values).toHaveBeenCalledTimes(1);
    expect(service.suggest).toEqual({
      options: optionsOf(["a!"]),
      status: "idle",
      more: false,
    });
  });

  it("asks with the field, the operator, and a live signal", () => {
    const values = vi.fn((_term: string, _lookup: Lookup) => []);
    const { service } = makeService({
      fields: {
        plain: { label: "Plain", values },
        amount: { label: "Amount", operators: ["over"], values },
      },
    });
    service.setDraft("Plain: x");
    const plain = values.mock.calls[0]![1];
    expect(plain).toEqual({ key: "plain", signal: expect.any(AbortSignal) });
    expect(plain.signal.aborted).toBe(false);
    service.setDraft("Amount: ");
    expect(values).toHaveBeenCalledTimes(1);
    service.setDraft("Amount: over  4 ");
    expect(values).toHaveBeenLastCalledWith("4", {
      key: "amount",
      op: "over",
      signal: expect.any(AbortSignal),
    });
    expect(plain.signal.aborted).toBe(true);
  });

  it("asks for the values of a draft the container starts with", () => {
    const state = { ...createQueryState(), draft: "Email: a" };
    const service = new QueryService(
      "search",
      { fields: { email: { label: "Email", values: (t) => [t] } } },
      state,
    );
    expect(service.items).toEqual(optionsOf(["a"]));
  });

  it("holds none for a draft written past the service", () => {
    const { service, state } = makeService({
      fields: {
        email: { label: "Email", values: (t) => [t] },
        owner: { label: "Owner", values: (t) => [t] },
      },
    });
    service.setDraft("Email: a");
    state.draft = "Owner: a";
    expect(service.items).toEqual([]);
  });

  it("drops what it held once the draft leaves the value stage", () => {
    const { service } = makeService({
      fields: { email: { label: "Email", values: () => ["a"] } },
    });
    service.setDraft("Email: ");
    expect(service.suggest.options).toHaveLength(1);
    service.setDraft("Em");
    expect(service.suggest).toEqual({
      options: [],
      status: "idle",
      more: false,
    });
    service.setDraft("Email: ");
    service.select(service.items[0]!);
    expect(service.draft).toBe("");
    expect(service.suggest.options).toEqual([]);
  });

  it("takes a page, and adds the next on more", () => {
    const values = vi.fn((_term: string, lookup: Lookup): Page => {
      const from = (lookup.cursor as number | undefined) ?? 0;
      return {
        values: [`v${from}`, `v${from + 1}`],
        next: from < 2 ? from + 2 : undefined,
      };
    });
    const { service } = makeService({
      fields: { email: { label: "Email", values } },
    });
    service.setDraft("Email: v");
    expect(service.suggest).toEqual({
      options: optionsOf(["v0", "v1"]),
      status: "idle",
      more: true,
    });
    service.more();
    expect(values).toHaveBeenLastCalledWith("v", {
      key: "email",
      signal: expect.any(AbortSignal),
      cursor: 2,
    });
    expect(service.items).toEqual(optionsOf(["v0", "v1", "v2", "v3"]));
    expect(service.suggest.more).toBe(false);
    service.more();
    expect(values).toHaveBeenCalledTimes(2);
  });

  it("reads a null next as the end, and any other as a cursor", () => {
    const pages: Page[] = [
      { values: ["a"], next: 0 },
      { values: ["b"], next: "" },
      { values: ["c"], next: null },
    ];
    const values = vi.fn(() => pages.shift()!);
    const { service } = makeService({
      fields: { email: { label: "Email", values } },
    });
    service.setDraft("Email: ");
    service.more();
    service.more();
    service.more();
    expect(values).toHaveBeenCalledTimes(3);
    expect(service.suggest.options).toHaveLength(3);
    expect(service.suggest.more).toBe(false);
  });

  it("drops a value it already holds, within a page and across them", () => {
    const pages: Page[] = [
      { values: ["a", "b", "a"], next: 1 },
      { values: ["b", "c"], next: 2 },
      { values: ["a", "c"] },
    ];
    const { service } = makeService({
      fields: { email: { label: "Email", values: () => pages.shift()! } },
    });
    service.setDraft("Email: ");
    expect(service.items).toEqual(optionsOf(["a", "b"]));
    service.more();
    expect(service.items).toEqual(optionsOf(["a", "b", "c"]));
    service.more();
    expect(service.items).toEqual(optionsOf(["a", "b", "c"]));
    expect(service.suggest.more).toBe(false);
  });

  it("starts the pages over when the draft changes", () => {
    const values = vi.fn((term: string, lookup: Lookup): Page => ({
      values: [`${term}${String(lookup.cursor ?? 0)}`],
      next: 1,
    }));
    const { service } = makeService({
      fields: { email: { label: "Email", values } },
    });
    service.setDraft("Email: a");
    service.more();
    service.setDraft("Email: b");
    expect(values.mock.calls[2]![1].cursor).toBeUndefined();
    expect(service.items).toEqual(optionsOf(["b0"]));
  });

  it("loads a promised list, then holds it", async () => {
    const { calls, values } = deferred();
    const { service } = makeService({
      fields: { email: { label: "Email", values } },
    });
    service.setDraft("Email: a");
    expect(service.suggest).toEqual({
      options: [],
      status: "loading",
      more: false,
    });
    calls[0]!.resolve(["alice"]);
    await settled();
    expect(service.suggest).toEqual({
      options: optionsOf(["alice"]),
      status: "idle",
      more: false,
    });
    expect(service.hint).toBe("lice");
  });

  it("keeps the options of the term before while the next loads", async () => {
    const { calls, values } = deferred();
    const { service } = makeService({
      fields: {
        email: { label: "Email", values },
        owner: { label: "Owner", operators: ["is", "not"], values },
      },
    });
    service.setDraft("Email: a");
    calls[0]!.resolve(["alice", "alan"]);
    await settled();
    service.setDraft("Email: al");
    expect(service.suggest.status).toBe("loading");
    expect(service.items).toEqual(optionsOf(["alice", "alan"]));
    calls[1]!.resolve(["alan"]);
    await settled();
    expect(service.items).toEqual(optionsOf(["alan"]));
    // Another field, and another operator of one, start from none.
    service.setDraft("Owner: is a");
    expect(service.items).toEqual([]);
    calls[2]!.resolve(["alan"]);
    await settled();
    service.setDraft("Owner: not a");
    expect(service.suggest).toEqual({
      options: [],
      status: "loading",
      more: false,
    });
  });

  it("aborts the lookup the draft moved on from and drops its result", async () => {
    const { calls, values } = deferred();
    const { service } = makeService({
      fields: { email: { label: "Email", values } },
    });
    service.setDraft("Email: a");
    service.setDraft("Email: al");
    expect(calls[0]!.lookup.signal.aborted).toBe(true);
    expect(calls[1]!.lookup.signal.aborted).toBe(false);
    calls[1]!.resolve(["alan"]);
    await settled();
    calls[0]!.resolve(["alice", "alan"]);
    await settled();
    expect(service.items).toEqual(optionsOf(["alan"]));
    service.setDraft("Email: ali");
    service.reset();
    expect(calls[2]!.lookup.signal.aborted).toBe(true);
    calls[2]!.resolve(["alice"]);
    await settled();
    expect(service.suggest).toEqual({
      options: [],
      status: "idle",
      more: false,
    });
  });

  it("extends by a promised page, one at a time", async () => {
    const { calls, values } = deferred();
    const { service } = makeService({
      fields: { email: { label: "Email", values } },
    });
    service.setDraft("Email: ");
    service.more();
    expect(calls).toHaveLength(1);
    calls[0]!.resolve({ values: ["a"], next: "p2" });
    await settled();
    service.more();
    service.more();
    expect(calls).toHaveLength(2);
    expect(calls[1]!.lookup.cursor).toBe("p2");
    expect(calls[1]!.lookup.signal).toBe(calls[0]!.lookup.signal);
    expect(service.suggest).toEqual({
      options: optionsOf(["a"]),
      status: "extending",
      more: true,
    });
    calls[1]!.resolve({ values: ["b"] });
    await settled();
    expect(service.suggest).toEqual({
      options: optionsOf(["a", "b"]),
      status: "idle",
      more: false,
    });
  });

  it("drops a page the draft moved on from", async () => {
    const { calls, values } = deferred();
    const { service } = makeService({
      fields: { email: { label: "Email", values } },
    });
    service.setDraft("Email: ");
    calls[0]!.resolve({ values: ["a"], next: 1 });
    await settled();
    service.more();
    service.setDraft("Email: b");
    expect(calls[1]!.lookup.signal.aborted).toBe(true);
    calls[2]!.resolve(["b"]);
    await settled();
    calls[1]!.resolve({ values: ["z"], next: 2 });
    await settled();
    expect(service.suggest).toEqual({
      options: optionsOf(["b"]),
      status: "idle",
      more: false,
    });
  });

  it("emits failed and settles empty when the first page rejects or throws", async () => {
    const { calls, values } = deferred();
    const boom = new Error("boom");
    const { service } = makeService({
      fields: {
        email: { label: "Email", values },
        owner: {
          label: "Owner",
          values: () => {
            throw boom;
          },
        },
      },
    });
    const failed = vi.fn();
    service.on("failed", failed);
    service.setDraft("Email: a");
    calls[0]!.resolve(["alice"]);
    await settled();
    service.setDraft("Email: al");
    calls[1]!.reject(boom);
    await settled();
    expect(failed).toHaveBeenCalledExactlyOnceWith({
      id: "search",
      error: boom,
    });
    expect(service.suggest).toEqual({
      options: [],
      status: "idle",
      more: false,
    });
    service.setDraft("Owner: a");
    expect(failed).toHaveBeenCalledTimes(2);
    expect(service.suggest.status).toBe("idle");
  });

  it("keeps the options and ends the pages when a page rejects", async () => {
    const { calls, values } = deferred();
    const { service } = makeService({
      fields: { email: { label: "Email", values } },
    });
    const failed = vi.fn();
    service.on("failed", failed);
    service.setDraft("Email: ");
    calls[0]!.resolve({ values: ["a"], next: 1 });
    await settled();
    service.more();
    calls[1]!.reject(new Error("boom"));
    await settled();
    expect(failed).toHaveBeenCalledTimes(1);
    expect(service.suggest).toEqual({
      options: optionsOf(["a"]),
      status: "idle",
      more: false,
    });
    service.more();
    expect(calls).toHaveLength(2);
  });

  it("stays quiet when an aborted lookup rejects", async () => {
    const { calls, values } = deferred();
    const { service } = makeService({
      fields: { email: { label: "Email", values } },
    });
    const failed = vi.fn();
    service.on("failed", failed);
    service.setDraft("Email: a");
    service.reset();
    calls[0]!.reject(calls[0]!.lookup.signal.reason);
    await settled();
    expect(failed).not.toHaveBeenCalled();
  });

  it("lands a result on a service held in a proxy that wraps what it reads", async () => {
    // As a reactive proxy does: an object read off the service comes back
    // wrapped, so it is never the object that was written.
    const wrap = <T extends object>(target: T): T =>
      new Proxy(target, {
        get: (t, k, r) => {
          const value: unknown = Reflect.get(t, k, r);
          return value !== null && typeof value === "object"
            ? wrap(value)
            : value;
        },
      });
    const { calls, values } = deferred();
    const service = wrap(
      makeService({ fields: { email: { label: "Email", values } } }).service,
    );
    service.setDraft("Email: ");
    calls[0]!.resolve({ values: ["a"], next: { page: 2 } });
    await settled();
    expect(service.items).toEqual(optionsOf(["a"]));
    service.more();
    expect(calls[1]!.lookup.cursor).toEqual({ page: 2 });
    calls[1]!.resolve(["b"]);
    await settled();
    expect(service.items).toEqual(optionsOf(["a", "b"]));
    service.setDraft("Email: c");
    expect(calls[1]!.lookup.signal.aborted).toBe(true);
  });

  it("ignores more with no provider, no page to follow, or no value stage", () => {
    const values = vi.fn(() => ["a"]);
    const { service } = makeService({
      fields: {
        email: { label: "Email", values },
        status: { label: "Status", values: ["Active"] },
      },
    });
    service.more();
    service.setDraft("Status: ");
    service.more();
    service.setDraft("Email: ");
    service.more();
    expect(values).toHaveBeenCalledTimes(1);
  });
});

describe("debounced", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("asks once, for the term the typing stopped on", async () => {
    vi.useFakeTimers();
    const values = vi.fn((term: string) => [term]);
    const { service } = makeService({
      fields: { email: { label: "Email", values: debounced(values, 200) } },
    });
    service.setDraft("Email: a");
    await vi.advanceTimersByTimeAsync(100);
    service.setDraft("Email: al");
    expect(service.suggest.status).toBe("loading");
    await vi.advanceTimersByTimeAsync(199);
    expect(values).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(values).toHaveBeenCalledTimes(1);
    expect(service.items).toEqual(optionsOf(["al"]));
  });

  it("asks for more at once", async () => {
    vi.useFakeTimers();
    const values = vi.fn((_term: string, lookup: Lookup): Page =>
      lookup.cursor ? { values: ["b"] } : { values: ["a"], next: 1 },
    );
    const { service } = makeService({
      fields: { email: { label: "Email", values: debounced(values, 200) } },
    });
    service.setDraft("Email: ");
    await vi.advanceTimersByTimeAsync(200);
    service.more();
    expect(service.items).toEqual(optionsOf(["a", "b"]));
  });

  it("fails the lookup when the provider throws after the wait", async () => {
    vi.useFakeTimers();
    const boom = new Error("boom");
    const { service } = makeService({
      fields: {
        email: {
          label: "Email",
          values: debounced(() => {
            throw boom;
          }, 200),
        },
      },
    });
    const failed = vi.fn();
    service.on("failed", failed);
    service.setDraft("Email: a");
    await vi.advanceTimersByTimeAsync(200);
    expect(failed).toHaveBeenCalledExactlyOnceWith({
      id: "search",
      error: boom,
    });
  });
});
