import type {
  Config,
  Entry,
  Event,
  Events,
  Field,
  Filter,
  Listener,
  Option,
  Options,
  Parse,
  Service,
  Stage,
  State,
} from "./types";
import type { Emitter } from "@zoobzio/kit";

import { entries } from "objectively";
import { makeEmitter, makeProxy } from "@zoobzio/kit";
import {
  QUERY_STATE_FIELDS,
  QUERY_TEXT_LABEL,
  QUERY_TEXT_QUOTE,
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
 * The headless query machine. Owns the committed entries: one text entry
 * and one filter per field and operator, each validated against the field
 * schema. Any view adds and removes entries directly.
 *
 * Owns a draft as well, for a text view: the draft walks the grammar
 * `Label: op term` through the field, operator and value stages of the
 * configured fields, or `"text"` through the text stage, and commits as an
 * entry. A view with no text input leaves the draft alone.
 *
 * The service reads and writes the `state` container through the `options`
 * middleware. The container can be a plain object or a reactive proxy. Each
 * write emits `change`; a change to the entries emits `changed`. `on`
 * subscribes.
 */
export class QueryService implements Service {
  readonly fields: Record<string, Field>;

  private readonly state: State;
  private readonly emitter: Emitter<Events> = makeEmitter();

  constructor(
    public readonly id: string,
    public readonly config: Config,
    state: State,
    options: Options = {},
  ) {
    this.state = makeProxy(state, QUERY_STATE_FIELDS, options, this.emitter);
    this.fields = config.fields;
  }

  on<E extends Event>(event: E, listener: Listener<E>): () => void {
    return this.emitter.on(event, listener);
  }

  // --- state -----------------------------------------------------------

  get entries(): Entry[] {
    return this.state.entries;
  }

  get draft(): string {
    return this.state.draft;
  }

  // --- entries ---------------------------------------------------------

  get text(): string {
    const entry = this.entries.find((e) => e.kind === "text");
    return entry?.value ?? "";
  }

  get filters(): Filter[] {
    const result: Filter[] = [];
    for (const entry of this.entries) {
      if (entry.kind !== "filter") continue;
      const { key, op, value } = entry;
      result.push(op ? { key, op, value } : { key, value });
    }
    return result;
  }

  /**
   * Commits an entry. An entry with the same identity (the text, or a
   * filter's key and operator) is replaced and moved to the end, so order
   * tracks recency. An entry equal to one already held is a no-op.
   *
   * A filter on an operator field takes the field's default operator when
   * none is given, and is rejected when its operator is not accepted. A
   * filter with an operator on a field that has none is rejected. A filter
   * on a key that is not a field passes through as given. Text is rejected
   * when the config turns it off, or when empty.
   *
   * @returns Whether the entries changed.
   */
  add(entry: Entry): boolean {
    const next = this.normalize(entry);
    if (!next) return false;
    const last = this.entries.at(-1);
    if (last && this.sameIdentity(last, next) && last.value === next.value) {
      return false;
    }
    this.state.entries = [
      ...this.entries.filter((e) => !this.sameIdentity(e, next)),
      next,
    ];
    this.emitChanged();
    return true;
  }

  remove(index: number): void {
    if (index < 0 || index >= this.entries.length) return;
    this.state.entries = this.entries.filter((_, i) => i !== index);
    this.emitChanged();
  }

  clear(): void {
    if (!this.entries.length) return;
    this.state.entries = [];
    this.emitChanged();
  }

  private normalize(entry: Entry): Entry | undefined {
    if (entry.kind === "text") {
      if (this.config.text === false || !entry.value) return undefined;
      return { kind: "text", value: entry.value };
    }
    const { key, value } = entry;
    let op = entry.op;
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

  private sameIdentity(a: Entry, b: Entry): boolean {
    if (a.kind !== b.kind) return false;
    if (a.kind === "text" || b.kind === "text") return true;
    return a.key === b.key && a.op === b.op;
  }

  private emitChanged(): void {
    this.emitter.emit("changed", { id: this.id, entries: this.entries });
  }

  // --- derived ---------------------------------------------------------

  private get textOn(): boolean {
    return this.config.text !== false;
  }

  /** The option that enters the text stage: the quote, under the label. */
  private textOption(active?: boolean): Option {
    const option: Option = {
      stage: "text",
      value: QUERY_TEXT_QUOTE,
      label: this.config.textLabel ?? QUERY_TEXT_LABEL,
    };
    return active ? { ...option, active } : option;
  }

  get parse(): Parse {
    const raw = this.draft;
    if (this.textOn && raw.startsWith(QUERY_TEXT_QUOTE)) {
      const body = raw.slice(1);
      const closed = body.endsWith(QUERY_TEXT_QUOTE);
      return { text: true, term: closed ? body.slice(0, -1) : body };
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
    const { field, op, text } = this.parse;
    if (text) return "text";
    if (!field) return "field";
    if (field.operators?.length && !op) return "op";
    return "value";
  }

  /**
   * The options of the active panel, narrowed by the term. The field panel
   * leads with the text option while nothing is typed; a term narrows it to
   * the fields alone. A value provider is given the term and its result
   * stands as is. Text takes no suggestions.
   */
  get items(): Option[] {
    const { field, term } = this.parse;
    const q = term.trim().toLowerCase();
    const matches = (label: string) => !q || label.toLowerCase().includes(q);
    switch (this.stage) {
      case "field":
        return [
          ...(this.textOn && !q ? [this.textOption()] : []),
          ...entries(this.fields)
            .filter(([, f]) => matches(f.label))
            .map(([key, f]) => fieldOption(key, f)),
        ];
      case "text":
        return [];
      case "op":
        return (field?.operators ?? [])
          .filter(matches)
          .map((o) => ({ stage: "op", value: o, label: o }));
      default: {
        const values = field?.values ?? [];
        const list =
          typeof values === "function"
            ? values(term.trim())
            : values.filter(matches);
        return list.map((v) => ({ stage: "value", value: v, label: v }));
      }
    }
  }

  /** The ancestor panels: the path taken, one active option per panel. */
  get trail(): Option[][] {
    const { key, field, op, text } = this.parse;
    if (text) return [[this.textOption(true)]];
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
   * Writes the draft. A quote that closes the text commits it at once: the
   * closing quote ends the text as Enter does.
   */
  setDraft(text: string): void {
    this.state.draft = text;
    if (this.parse.text && text.length > 1 && text.endsWith(QUERY_TEXT_QUOTE)) {
      this.submit();
    }
  }

  reset(): void {
    this.state.draft = "";
  }

  /**
   * A field, operator or text option enters its stage; an active one steps
   * back out. The text option opens a quote before the term typed so far.
   * A value option commits.
   */
  select(option: Option): void {
    const { key, op, term } = this.parse;
    switch (option.stage) {
      case "field":
        this.state.draft = option.active ? "" : this.stageText(option.value);
        return;
      case "text":
        if (!this.textOn) return;
        this.state.draft = option.active ? "" : `${QUERY_TEXT_QUOTE}${term}`;
        return;
      case "op":
        if (!key) return;
        this.state.draft = option.active
          ? this.stageText(key)
          : this.stageText(key, option.value);
        return;
      default:
        if (key) this.commit({ kind: "filter", key, op, value: option.value });
    }
  }

  /**
   * Commits the term: as the field's value when a field is set, as text
   * when the draft is quoted. An empty term is ignored, and so is a bare
   * term, which is a field still being named.
   */
  submit(): void {
    const { key, op, text, term } = this.parse;
    const value = term.trim();
    if (!value) return;
    if (key) this.commit({ kind: "filter", key, op, value });
    else if (text) this.commit({ kind: "text", value });
  }

  /**
   * Takes the last entry back into the draft, minus one character, so
   * entries erase like continuous text: a text entry loses its closing
   * quote and is back in the text stage.
   */
  unwrap(): void {
    const index = this.entries.length - 1;
    const entry = this.entries[index];
    if (!entry) return;
    this.remove(index);
    this.state.draft = this.textFor(entry).slice(0, -1);
  }

  /** Adds the entry; a landed entry clears the draft. */
  private commit(entry: Entry): void {
    if (this.add(entry)) this.state.draft = "";
  }

  // --- text ------------------------------------------------------------

  /** The text that enters a stage: `Label: ` or `Label: op `. */
  stageText(key: string, op?: string): string {
    return `${this.labelOf(key)}: ${op ? `${op} ` : ""}`;
  }

  /** The text that commits an entry: `Label: op value`, or `"text"`. */
  textFor(entry: Entry): string {
    if (entry.kind === "text") {
      return `${QUERY_TEXT_QUOTE}${entry.value}${QUERY_TEXT_QUOTE}`;
    }
    return `${this.stageText(entry.key, entry.op)}${entry.value}`;
  }

  /**
   * The display label of an entry: its text, so a chip reads as the draft
   * that made it.
   */
  labelFor(entry: Entry): string {
    return this.textFor(entry);
  }

  private labelOf(key: string): string {
    return this.fields[key]?.label ?? key;
  }
}
