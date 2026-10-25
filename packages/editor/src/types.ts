import type {
  Change as KitChange,
  ChangeEvents,
  Changers as KitChangers,
  Changes as KitChanges,
  Codec as KitCodec,
  Listener as KitListener,
  Middleware as KitMiddleware,
  Options as KitOptions,
  Step,
} from "@zoobzio/kit";

import type { ChainedCommands, Extensions, JSONContent } from "@tiptap/core";
import type { Schema } from "@tiptap/pm/model";

/**
 * The editor's own form: tiptap's JSON document. What a reader produces and
 * a writer consumes.
 */
export type Doc = JSONContent;

/**
 * A heading level the editor offers.
 */
export type Level = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Config the consumer provides — pure serializable data: which features
 * the editor offers. Every feature is on unless turned off. `headings`
 * lists the levels offered; `false` removes headings. `code` covers inline
 * code and code blocks; `lists` covers bullet and ordered lists; `rule` is
 * the horizontal rule; `history` is undo and redo.
 */
export type Config = {
  headings?: Level[] | false;
  lists?: boolean;
  links?: boolean;
  code?: boolean;
  blockquote?: boolean;
  rule?: boolean;
  history?: boolean;
};

/**
 * Which marks and nodes of the schema are active at the selection, by
 * name. What a toolbar reads.
 */
export type Active = Record<string, boolean>;

/**
 * The state container the service reads and writes: the revision, which
 * counts every change to the document; whether the document is empty; the
 * active marks and nodes; and whether the editor is mounted. The document
 * itself is not here: it lives in the editor, and `document` writes it on
 * read. The container can be a plain object or a reactive proxy.
 */
export type State = {
  revision: number;
  empty: boolean;
  active: Active;
  mounted: boolean;
};

export type StateKey = keyof State;

export type Middleware = KitMiddleware<State>;
export type Options = KitOptions<State>;
export type Changes = KitChanges<State>;
export type Change<K extends StateKey = StateKey> = KitChange<State, K>;
export type Changers = KitChangers<State>;

/**
 * What a reader or writer may ask of the editor: the schema and the
 * extensions it was built with. A transform asks these; it never guesses
 * what the editor models.
 */
export type Context = {
  schema: Schema;
  extensions: Extensions;
};

/**
 * Ingestion: a source document in the consumer's form `I`, as the editor's
 * document. Synchronous. A reader that must fetch or parse asynchronously
 * does so before `load`.
 */
export type Reader<I> = Step<I, Doc, Context>;

/**
 * Consumption: the editor's document as the consumer's form `O`.
 */
export type Writer<O> = Step<Doc, O, Context>;

/**
 * The kit's codec bound to the editor's document: a reader and a writer
 * over one form, or over two when ingestion and consumption differ.
 */
export type Codec<I, O = I> = KitCodec<I, Doc, O, Context>;

/**
 * The consumer-supplied behavior: the reader and writer, and any tiptap
 * extensions beyond the feature set — the nodes and marks of the
 * consumer's own vocabulary.
 */
export type Actions<I, O> = Codec<I, O> & {
  extensions?: Extensions;
};

/**
 * The events of an editor service, keyed by name.
 *
 * - `change`: a field of the container was written.
 * - `loaded`: a source document replaced the editor's. Not an update.
 * - `updated`: the document changed. `revision` is the new revision.
 * - `mounted`: the editor attached to an element.
 * - `unmounted`: the editor left its element.
 */
export type Events = ChangeEvents<State> & {
  loaded: [event: { id: string; revision: number }];
  updated: [event: { id: string; revision: number }];
  mounted: [event: { id: string }];
  unmounted: [event: { id: string }];
};

export type Event = keyof Events;

export type Listener<E extends Event> = KitListener<Events, E>;

/**
 * The editor machine: one document, read in through the reader, written
 * out through the writer, edited through the commands.
 */
export type Service<I, O> = {
  readonly id: string;
  readonly config: Config;
  readonly context: Context;

  readonly revision: number;
  readonly empty: boolean;
  readonly active: Active;
  readonly mounted: boolean;

  /**
   * The document in the editor's own form. Reads the revision, so a
   * reactive container recomputes it on every change.
   */
  readonly json: Doc;

  /**
   * The document in the consumer's form, through the writer. Written on
   * read, not on change: a reader that is not asked costs nothing.
   */
  readonly document: O;

  load(source: I): void;

  toggle(mark: string, attrs?: Record<string, unknown>): boolean;
  block(node: string, attrs?: Record<string, unknown>): boolean;
  wrap(node: string, attrs?: Record<string, unknown>): boolean;
  list(node: string): boolean;
  insert(content: Doc | Doc[]): boolean;
  undo(): boolean;
  redo(): boolean;
  run(commands: (chain: ChainedCommands) => ChainedCommands): boolean;
  isActive(name: string, attrs?: Record<string, unknown>): boolean;

  focus(position?: "start" | "end" | "all" | number): boolean;
  /** Takes the element over as the editor's DOM; its content is replaced by the document's. */
  mount(element: HTMLElement): void;
  unmount(): void;
  destroy(): void;

  on<E extends Event>(event: E, listener: Listener<E>): () => void;
};
