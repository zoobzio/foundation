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

import type {
  Extension,
  StateCommand,
  TransactionSpec,
} from "@codemirror/state";

/**
 * The editor's own form: the text. What a reader produces and a writer
 * consumes.
 */
export type Doc = string;

/**
 * Config the consumer provides — pure serializable data: which features
 * the editor offers. Every feature is on unless turned off. `history` is
 * undo and redo, with their key bindings. Language, theme, highlighting,
 * gutters, and keymaps are not features: they are the consumer's
 * CodeMirror extensions, passed through untouched.
 */
export type Config = {
  history?: boolean;
};

/**
 * Where the selection's head is: the line, counted from one, and the
 * column within it, counted from one. What a status line reads.
 */
export type Cursor = {
  line: number;
  column: number;
};

/**
 * A span of the document, as offsets.
 */
export type Range = {
  from: number;
  to: number;
};

/**
 * A point in the viewport, in CSS pixels, as a pointer event reports it.
 */
export type Point = {
  x: number;
  y: number;
};

/**
 * Where `focus` places the selection: the document's start or end, the
 * whole document, or one offset.
 */
export type Position = "start" | "end" | "all" | number;

/**
 * The state container the service reads and writes: the revision, which
 * counts every change to the document; whether the document is empty; the
 * cursor; and whether the editor is mounted. The document itself is not
 * here: it lives in the editor, and `document` writes it on read. The
 * container can be a plain object or a reactive proxy.
 */
export type State = {
  revision: number;
  empty: boolean;
  cursor: Cursor;
  mounted: boolean;
};

export type StateKey = keyof State;

export type Middleware = KitMiddleware<State>;
export type Options = KitOptions<State>;
export type Changes = KitChanges<State>;
export type Change<K extends StateKey = StateKey> = KitChange<State, K>;
export type Changers = KitChangers<State>;

/**
 * What a reader or writer may ask of the editor: the extensions it was
 * built with, the consumer's and then the feature set's. A transform asks
 * these; it never guesses what the editor models.
 */
export type Context = {
  extensions: Extension[];
};

/**
 * Ingestion: a source document in the consumer's form `I`, as the editor's
 * text. Synchronous. A reader that must fetch or parse asynchronously does
 * so before `load`.
 */
export type Reader<I> = Step<I, Doc, Context>;

/**
 * Consumption: the editor's text as the consumer's form `O`.
 */
export type Writer<O> = Step<Doc, O, Context>;

/**
 * The kit's codec bound to the editor's text: a reader and a writer over
 * one form, or over two when ingestion and consumption differ.
 */
export type Codec<I, O = I> = KitCodec<I, Doc, O, Context>;

/**
 * The consumer-supplied behavior: the reader and writer, and the CodeMirror
 * extensions beyond the feature set — the language, the theme, the
 * highlight style, the gutters, the keymaps, whatever the consumer would
 * hand CodeMirror itself. They come first in the editor's extensions, so a
 * consumer's key binding wins over the feature set's.
 */
export type Actions<I, O> = Codec<I, O> & {
  extensions?: Extension[];
};

/**
 * The events of a code service, keyed by name.
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
 * The code editor machine: one text document, read in through the reader,
 * written out through the writer, edited through transactions.
 */
export type Service<I, O> = {
  readonly id: string;
  readonly config: Config;
  readonly context: Context;

  readonly revision: number;
  readonly empty: boolean;
  readonly cursor: Cursor;
  readonly mounted: boolean;

  /**
   * The document in the editor's own form. Reads the revision, so a
   * reactive container recomputes it on every change.
   */
  readonly text: Doc;

  /**
   * The document in the consumer's form, through the writer. Written on
   * read, not on change: a reader that is not asked costs nothing.
   */
  readonly document: O;

  load(source: I): void;

  /** Runs a CodeMirror state command against the editor. */
  run(command: StateCommand): boolean;
  /** Applies transaction specs as one transaction. */
  dispatch(...specs: TransactionSpec[]): boolean;
  /** Inserts text at the selection, at an offset, or over a range. */
  insert(text: string, at?: number | Range): boolean;
  select(from: number, to?: number): boolean;
  undo(): boolean;
  redo(): boolean;

  /** The offset under a viewport point, while mounted. */
  locate(point: Point): number | null;
  focus(position?: Position): boolean;
  /** Puts the editor's DOM in the element; its content is replaced. */
  mount(element: HTMLElement): void;
  unmount(): void;
  destroy(): void;

  on<E extends Event>(event: E, listener: Listener<E>): () => void;
};
