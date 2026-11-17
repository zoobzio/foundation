import type {
  Config,
  Clause,
  Event,
  Events,
  Field,
  Filter,
  Listener,
  Literal,
  Lookup,
  Option,
  Options,
  Page,
  Parse,
  Provider,
  Service,
  Stage,
  State,
  Suggest,
  SuggestStatus,
} from "./types";
import type { Emitter } from "@zoobzio/kit";

import { entries } from "objectively";
import { makeEmitter, makeProxy } from "@zoobzio/kit";
import {
  QUERY_LITERALS,
  QUERY_STATE_FIELDS,
  QUERY_TEXT_KEY,
} from "./constants";

/**
 * A field's option. The field's properties beyond the ones the query reads
 * (what a layer widens it with, such as an icon) are carried onto it, so
 * the option draws as the field does.
 */
const fieldOption = (key: string, field: Field, active?: boolean): Option => {
  const {
    label,
    operators: _o,
    defaultOperator: _d,
    values: _v,
    ...rest
  } = field;
  const option: Option = { ...rest, stage: "field", value: key, label };
  return active ? { ...option, active } : option;
};

/**
 * A literal's option: its key under its label, with the literal's widened
 * properties carried onto it as a field's are. Never active, as the
 * literal stage adds no trail.
 */
const literalOption = (key: string, literal: Literal): Option => {
  const { label, open: _o, close: _c, ...rest } = literal;
  return { ...rest, stage: "literal", value: key, label };
};

/**
 * The literal a draft opens with: the one whose `open` the draft starts
 * with, the longest first, so a literal whose `open` extends another's
 * wins.
 */
const literalOf = (
  literals: Record<string, Literal>,
  raw: string,
): [string, Literal] | undefined =>
  entries(literals)
    .sort(([, a], [, b]) => b.open.length - a.open.length)
    .find(([, l]) => raw.startsWith(l.open));

/**
 * The operator the rest of a draft (after `Label: `) names: the longest of
 * the field's operators that the rest starts with, followed by a space, so
 * an operator typed without its space is still being completed. Matched
 * without case; the field's spelling is returned.
 */
const operatorOf = (field: Field, rest: string): string | undefined => {
  const operators = field.operators;
  if (!operators?.length) return undefined;
  const lower = rest.toLowerCase();
  return [...operators]
    .sort((a, b) => b.length - a.length)
    .find((o) => lower.startsWith(`${o.toLowerCase()} `));
};

/**
 * A lookup: its controller, which aborts it once the draft moves on, and
 * the cursor of the page after its last.
 */
type Live = { controller: AbortController; cursor?: unknown };

/** The scope of a lookup: the field and operator its values are for. */
const scopeOf = (key: string, op?: string): string => `${key}\n${op ?? ""}`;

/** Whether a provider's result is a page rather than the whole list. */
const isPage = (result: readonly string[] | Page): result is Page =>
  !Array.isArray(result);

/** Whether a provider's result is still to come. */
const isPending = <T>(result: T | Promise<T>): result is Promise<T> =>
  typeof result === "object" &&
  result !== null &&
  "then" in result &&
  typeof result.then === "function";

/**
 * The headless query machine. Owns the committed clauses: one clause per
 * literal and one filter per field and operator, each validated against
 * the config. Any view adds and removes clauses directly.
 *
 * Owns a draft as well, for a text view: the draft walks the grammar
 * `Label: op term` through the field, operator and value stages of the
 * configured fields, or `open term close` through the literal stage of a
 * configured literal, and commits as a clause. A view with no text input
 * leaves the draft alone.
 *
 * A field's values provider is asked once per change of the draft, at the
 * value stage, and what it gives is held in `suggest`: a list at once, a
 * promise once it resolves. A lookup the draft has moved on from is
 * aborted and its result dropped. `more` asks for the page after the last
 * while the provider names one.
 *
 * The service reads and writes the `state` container through the `options`
 * middleware. The container can be a plain object or a reactive proxy. Each
 * write emits `change`; a change to the clauses emits `changed`. `on`
 * subscribes.
 */
export class QueryService implements Service {
  readonly fields: Record<string, Field>;
  readonly literals: Record<string, Literal>;

  private readonly state: State;
  private readonly emitter: Emitter<Events> = makeEmitter();

  /**
   * The lookup of the draft's term, and the scope its options are for.
   * The lookup is held behind a function: a view may hold the service in
   * a reactive proxy, which wraps an object it reads off the service but
   * hands a function back as it is, so the lookup read here is the one
   * written, and its identity tells a late result apart.
   */
  private live: (() => Live) | undefined;
  private scope: string | undefined;

  constructor(
    public readonly id: string,
    public readonly config: Config,
    state: State,
    options: Options = {},
  ) {
    this.state = makeProxy(state, QUERY_STATE_FIELDS, options, this.emitter);
    this.fields = config.fields;
    this.literals = config.literals ?? QUERY_LITERALS;
    this.lookup();
  }

  on<E extends Event>(event: E, listener: Listener<E>): () => void {
    return this.emitter.on(event, listener);
  }

  // --- state -----------------------------------------------------------

  get clauses(): Clause[] {
    return this.state.clauses;
  }

  get draft(): string {
    return this.state.draft;
  }

  get suggest(): Suggest {
    return this.state.suggest;
  }

  // --- clauses --------------------------------------------------------

  get text(): string {
    const clause = this.clauses.find(
      (e) => e.kind === "literal" && e.key === QUERY_TEXT_KEY,
    );
    return clause?.value ?? "";
  }

  get filters(): Filter[] {
    const result: Filter[] = [];
    for (const clause of this.clauses) {
      if (clause.kind !== "filter") continue;
      const { key, op, value } = clause;
      result.push(op ? { key, op, value } : { key, value });
    }
    return result;
  }

  /**
   * Commits a clause. A clause with the same identity (a literal's key, or
   * a filter's key and operator) is replaced and moved to the end, so order
   * tracks recency. A clause equal to one already held is a no-op.
   *
   * A filter on an operator field takes the field's default operator when
   * none is given, and is rejected when its operator is not accepted. A
   * filter with an operator on a field that has none is rejected. A filter
   * on a key that is not a field passes through as given. A literal is
   * rejected when its key is not a configured literal, or when empty.
   *
   * @returns Whether the clauses changed.
   */
  add(clause: Clause): boolean {
    const next = this.normalize(clause);
    if (!next) return false;
    const last = this.clauses.at(-1);
    if (last && this.sameIdentity(last, next) && last.value === next.value) {
      return false;
    }
    this.state.clauses = [
      ...this.clauses.filter((e) => !this.sameIdentity(e, next)),
      next,
    ];
    this.emitChanged();
    return true;
  }

  remove(index: number): void {
    if (index < 0 || index >= this.clauses.length) return;
    this.state.clauses = this.clauses.filter((_, i) => i !== index);
    this.emitChanged();
  }

  clear(): void {
    if (!this.clauses.length) return;
    this.state.clauses = [];
    this.emitChanged();
  }

  /**
   * Commits a whole set of clauses in place of the ones held, as `add`
   * would one at a time: each is checked the same way, a rejected one is
   * left out, and of two with one identity the later stands. One
   * `changed` follows, where `add` would emit per clause.
   *
   * @returns Whether the clauses changed.
   */
  replace(clauses: Clause[]): boolean {
    let next: Clause[] = [];
    for (const clause of clauses) {
      const checked = this.normalize(clause);
      if (!checked) continue;
      next = [...next.filter((e) => !this.sameIdentity(e, checked)), checked];
    }
    if (JSON.stringify(next) === JSON.stringify(this.clauses)) return false;
    this.state.clauses = next;
    this.emitChanged();
    return true;
  }

  private normalize(clause: Clause): Clause | undefined {
    if (clause.kind === "literal") {
      const { key, value } = clause;
      if (!this.literals[key] || !value) return undefined;
      return { kind: "literal", key, value };
    }
    const { key, value } = clause;
    let op = clause.op;
    const field = this.fields[key];
    if (field) {
      const accepted = field.operators ?? [];
      if (accepted.length) {
        op = op ?? field.defaultOperator;
        if (!op || !accepted.includes(op)) return undefined;
      } else if (op) {
        return undefined;
      }
    }
    return op
      ? { kind: "filter", key, op, value }
      : { kind: "filter", key, value };
  }

  private sameIdentity(a: Clause, b: Clause): boolean {
    if (a.kind !== b.kind || a.key !== b.key) return false;
    if (a.kind === "literal" || b.kind === "literal") return true;
    return a.op === b.op;
  }

  private emitChanged(): void {
    this.emitter.emit("changed", { id: this.id, clauses: this.clauses });
  }

  // --- derived ---------------------------------------------------------

  get parse(): Parse {
    const raw = this.draft;
    const opened = literalOf(this.literals, raw);
    if (opened) {
      const [key, literal] = opened;
      const body = raw.slice(literal.open.length);
      const closed = body.endsWith(literal.close);
      const term = closed ? body.slice(0, -literal.close.length) : body;
      return { key, literal, term };
    }
    const idx = raw.indexOf(":");
    if (idx < 0) return { term: raw };
    const prefix = raw.slice(0, idx).trim().toLowerCase();
    const found = entries(this.fields).find(
      ([, f]) => f.label.toLowerCase() === prefix,
    );
    if (!found) return { term: raw };
    const [key, field] = found;
    const rest = raw.slice(idx + 1).trimStart();
    const op = operatorOf(field, rest);
    if (op) {
      return { key, field, op, term: rest.slice(op.length + 1).trimStart() };
    }
    return { key, field, term: rest };
  }

  get stage(): Stage {
    const { field, op, literal } = this.parse;
    if (literal) return "literal";
    if (!field) return "field";
    if (field.operators?.length && !op) return "op";
    return "value";
  }

  /**
   * The options of the active panel, narrowed by the term. The field panel
   * leads with the literal options while nothing is typed; a term narrows
   * it to the fields alone. A values provider's options are the ones
   * `suggest` holds for the draft's field and operator: what the provider
   * gave, as given. A literal takes no suggestions.
   */
  get items(): Option[] {
    const { key, field, op, term } = this.parse;
    const q = term.trim().toLowerCase();
    const matches = (label: string) => !q || label.toLowerCase().includes(q);
    switch (this.stage) {
      case "field":
        return [
          ...(q
            ? []
            : entries(this.literals).map(([key, l]) => literalOption(key, l))),
          ...entries(this.fields)
            .filter(([, f]) => matches(f.label))
            .map(([key, f]) => fieldOption(key, f)),
        ];
      case "literal":
        return [];
      case "op":
        return (field?.operators ?? [])
          .filter(matches)
          .map((o) => ({ stage: "op", value: o, label: o }));
      default: {
        const values = field?.values ?? [];
        if (typeof values === "function") {
          return this.scope === scopeOf(key ?? "", op)
            ? this.suggest.options
            : [];
        }
        return values
          .filter(matches)
          .map((v) => ({ stage: "value", value: v, label: v }));
      }
    }
  }

  /**
   * The ancestor panels: the path taken, one active option per panel. A
   * literal adds none: its stage is terminal, so the panels are empty
   * while it is typed.
   */
  get trail(): Option[][] {
    const { key, field, op } = this.parse;
    if (!key || !field) return [];
    const trail: Option[][] = [[fieldOption(key, field, true)]];
    if (op) trail.push([{ stage: "op", value: op, label: op, active: true }]);
    return trail;
  }

  /** The trail panels, then the active panel when it has options. */
  get panels(): Option[][] {
    const result = [...this.trail];
    if (this.items.length) result.push(this.items);
    return result;
  }

  /**
   * The inline completion: the rest of the first panel option whose label
   * starts with the term. A field completion ends in `: `, an operator
   * completion in a space.
   */
  get hint(): string {
    const q = this.parse.term.toLowerCase();
    if (!q) return "";
    const match = this.items.find(
      (i) => i.label.toLowerCase().startsWith(q) && i.label.length > q.length,
    );
    if (!match) return "";
    const rest = match.label.slice(q.length);
    switch (this.stage) {
      case "field":
        return `${rest}: `;
      case "op":
        return `${rest} `;
      default:
        return rest;
    }
  }

  // --- draft -----------------------------------------------------------

  /**
   * Writes the draft. A literal's `close` commits the literal at once: the
   * closing character ends it as Enter does. The draft must hold both
   * characters, so an `open` that is also the `close` opens the literal
   * rather than closing it.
   */
  setDraft(text: string): void {
    this.write(text);
    const { literal } = this.parse;
    if (!literal) return;
    const { open, close } = literal;
    if (text.length >= open.length + close.length && text.endsWith(close)) {
      this.submit();
    }
  }

  reset(): void {
    this.write("");
  }

  /**
   * A field or operator option enters its stage; an active one steps back
   * out. A literal option opens the literal before the term typed so far.
   * A value option commits.
   */
  select(option: Option): void {
    const { key, op, term } = this.parse;
    switch (option.stage) {
      case "field":
        this.write(option.active ? "" : this.stageText(option.value));
        return;
      case "literal": {
        const literal = this.literals[option.value];
        if (literal) this.write(`${literal.open}${term}`);
        return;
      }
      case "op":
        if (!key) return;
        this.write(
          option.active
            ? this.stageText(key)
            : this.stageText(key, option.value),
        );
        return;
      default:
        if (key) this.commit({ kind: "filter", key, op, value: option.value });
    }
  }

  /**
   * Commits the term: as the field's value when a field is set, as the
   * literal's value when a literal is open. An empty term is ignored, and
   * so is a bare term, which is a field still being named.
   */
  submit(): void {
    const { key, op, literal, term } = this.parse;
    const value = term.trim();
    if (!value || !key) return;
    if (literal) this.commit({ kind: "literal", key, value });
    else this.commit({ kind: "filter", key, op, value });
  }

  /**
   * Takes the last clause back into the draft, minus one character, so
   * clauses erase like continuous text: a literal loses the last character
   * of its `close` and is back in the literal stage.
   */
  unwrap(): void {
    const index = this.clauses.length - 1;
    const clause = this.clauses[index];
    if (!clause) return;
    this.remove(index);
    this.write(this.textFor(clause).slice(0, -1));
  }

  /** Adds the clause; a landed clause clears the draft. */
  private commit(clause: Clause): void {
    if (this.add(clause)) this.write("");
  }

  /** Writes the draft, then looks its values up: the one writer of both. */
  private write(text: string): void {
    this.state.draft = text;
    this.lookup();
  }

  // --- values ----------------------------------------------------------

  /**
   * Asks the provider of the draft's field for the page after the last.
   * Ignored while a lookup is out, and once the provider names no page
   * to follow. The page's values join the options; one already among
   * them is dropped, so a list that shifts between pages repeats nothing.
   */
  more(): void {
    const { options, status, more } = this.suggest;
    const live = this.live?.();
    if (!live || status !== "idle" || !more) return;
    const { key, field, op, term } = this.parse;
    const provider = field?.values;
    if (!key || typeof provider !== "function") return;
    this.ask(
      provider,
      term.trim(),
      {
        key,
        ...(op && { op }),
        signal: live.controller.signal,
        cursor: live.cursor,
      },
      live,
      "extending",
      options,
      options,
    );
  }

  /**
   * Looks up the values of the draft: aborts the lookup before, then asks
   * the provider of the field for the first page of the term. A draft at
   * any other stage, or on a field with no provider, holds none. The
   * options of the term before stay until the first page lands, as long
   * as the field and operator are the same.
   */
  private lookup(): void {
    this.live?.().controller.abort();
    this.live = undefined;
    const { key, field, op, term } = this.parse;
    const provider = field?.values;
    if (!key || this.stage !== "value" || typeof provider !== "function") {
      this.scope = undefined;
      const { options, status, more } = this.suggest;
      if (options.length || status !== "idle" || more) {
        this.state.suggest = { options: [], status: "idle", more: false };
      }
      return;
    }
    const scope = scopeOf(key, op);
    const held = scope === this.scope ? this.suggest.options : [];
    this.scope = scope;
    const live: Live = { controller: new AbortController() };
    this.live = () => live;
    this.ask(
      provider,
      term.trim(),
      { key, ...(op && { op }), signal: live.controller.signal },
      live,
      "loading",
      held,
      [],
    );
  }

  /**
   * Asks a provider and lands its result on `base`. A list or a page
   * lands at once; a promise shows `held` under `status` until it
   * settles. A result whose lookup the draft has moved on from is
   * dropped. A provider that throws or rejects settles on `base`, with no
   * page to follow, and emits `failed`.
   */
  private ask(
    provider: Provider,
    term: string,
    lookup: Lookup,
    live: Live,
    status: SuggestStatus,
    held: Option[],
    base: Option[],
  ): void {
    const land = (result: readonly string[] | Page): void => {
      if (this.live?.() !== live) return;
      const page = isPage(result) ? result : { values: result };
      const seen = new Set(base.map((o) => o.value));
      const options = [...base];
      for (const value of page.values) {
        if (seen.has(value)) continue;
        seen.add(value);
        options.push({ stage: "value", value, label: value });
      }
      live.cursor = page.next ?? undefined;
      this.state.suggest = {
        options,
        status: "idle",
        more: live.cursor !== undefined,
      };
    };
    const fail = (error: unknown): void => {
      if (this.live?.() !== live) return;
      live.cursor = undefined;
      this.state.suggest = { options: base, status: "idle", more: false };
      this.emitter.emit("failed", { id: this.id, error });
    };
    let result: ReturnType<Provider>;
    try {
      result = provider(term, lookup);
    } catch (error) {
      fail(error);
      return;
    }
    if (!isPending(result)) {
      land(result);
      return;
    }
    this.state.suggest = { options: held, status, more: status !== "loading" };
    result.then(land, fail);
  }

  // --- text ------------------------------------------------------------

  /** The text that enters a stage: `Label: ` or `Label: op `. */
  stageText(key: string, op?: string): string {
    return `${this.labelOf(key)}: ${op ? `${op} ` : ""}`;
  }

  /**
   * The text that commits a clause: `Label: op value`, or the literal's
   * value between its characters, `"text"`. A literal whose key is not
   * configured is written bare.
   */
  textFor(clause: Clause): string {
    if (clause.kind === "literal") {
      const literal = this.literals[clause.key];
      if (!literal) return clause.value;
      return `${literal.open}${clause.value}${literal.close}`;
    }
    return `${this.stageText(clause.key, clause.op)}${clause.value}`;
  }

  /**
   * The display label of a clause: its text, so a chip reads as the draft
   * that made it.
   */
  labelFor(clause: Clause): string {
    return this.textFor(clause);
  }

  private labelOf(key: string): string {
    return this.fields[key]?.label ?? key;
  }
}
