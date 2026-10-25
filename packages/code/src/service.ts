import type {
  Actions,
  Config,
  Context,
  Cursor,
  Event,
  Events,
  Listener,
  Options,
  Point,
  Position,
  Range,
  Service,
  State,
} from "./types";
import type { Emitter } from "@zoobzio/kit";
import type {
  Extension,
  StateCommand,
  Transaction,
  TransactionSpec,
} from "@codemirror/state";

import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { redo, undo } from "@codemirror/commands";
import { makeEmitter, makeProxy } from "@zoobzio/kit";
import { CODE_EMPTY_DOCUMENT, CODE_STATE_FIELDS } from "./constants";
import { cursor, features, same } from "./util";

/**
 * The headless code editor machine. Owns one CodeMirror state, built from
 * the consumer's extensions and the feature set, with no view: the state
 * holds the document and runs the transactions with no DOM, and `mount`
 * attaches a view to an element later. Delegates the document's form to
 * `actions`: the reader turns a source into the editor's text, the writer
 * turns the editor's text into the consumer's.
 *
 * The service reads and writes the `state` container through the `options`
 * middleware. The container holds the revision, the empty flag, the
 * cursor, and the mounted flag, never the document. Each write emits
 * `change`; the lifecycle emits `loaded`, `updated`, `mounted`, and
 * `unmounted`. `on` subscribes.
 */
export class CodeService<I, O> implements Service<I, O> {
  public readonly config: Config;
  public readonly context: Context;

  private readonly state: State;
  private readonly emitter: Emitter<Events> = makeEmitter();
  private current: EditorState;
  private view: EditorView | null = null;

  constructor(
    public readonly id: string,
    config: Config,
    state: State,
    private readonly actions: Actions<I, O>,
    options: Options = {},
  ) {
    this.config = Object.freeze({ ...config });
    this.state = makeProxy(state, CODE_STATE_FIELDS, options, this.emitter);

    // The consumer's extensions first: a consumer's key binding wins over
    // the feature set's.
    const extensions: Extension[] = [
      ...(actions.extensions ?? []),
      ...features(config),
    ];
    this.context = { extensions };
    this.current = EditorState.create({ doc: CODE_EMPTY_DOCUMENT, extensions });

    // A non-extensible object is never wrapped by a reactive proxy (Vue
    // skips non-extensible targets), so the view stays raw however the
    // consumer holds the service. CodeMirror's view owns DOM observers a
    // proxy must not reach.
    Object.preventExtensions(this);
  }

  on<E extends Event>(event: E, listener: Listener<E>): () => void {
    return this.emitter.on(event, listener);
  }

  // --- state -----------------------------------------------------------

  get revision(): number {
    return this.state.revision;
  }
  get empty(): boolean {
    return this.state.empty;
  }
  get cursor(): Cursor {
    return this.state.cursor;
  }
  get mounted(): boolean {
    return this.state.mounted;
  }

  // --- document --------------------------------------------------------

  get text(): string {
    return this.at(this.revision, () => this.current.doc.toString());
  }

  get document(): O {
    return this.actions.write(this.text, this.context);
  }

  /**
   * Reads at a revision: the read is tied to the container's revision, so
   * a reactive container recomputes it on every change.
   */
  private at<T>(_revision: number, read: () => T): T {
    return read();
  }

  /**
   * Replaces the document through the reader. The history starts over: a
   * loaded document is a new state, not an edit to undo.
   */
  load(source: I): void {
    const doc = this.actions.read(source, this.context);
    this.current = EditorState.create({
      doc,
      extensions: this.context.extensions,
    });
    this.view?.setState(this.current);
    this.state.revision = this.revision + 1;
    this.state.empty = this.current.doc.length === 0;
    this.refresh();
    this.emitter.emit("loaded", { id: this.id, revision: this.revision });
  }

  /**
   * Lands transactions: through the view when mounted, so the view's own
   * dispatch settles them, and straight onto the state when not.
   */
  private apply(transactions: readonly Transaction[]): boolean {
    if (transactions.length === 0) return false;
    if (this.view) this.view.dispatch(transactions);
    else this.settle(transactions);
    return true;
  }

  /**
   * Takes the state after transactions, from the view when mounted. A
   * document change bumps the revision and emits `updated`; any
   * transaction may move the cursor.
   */
  private settle(transactions: readonly Transaction[]): void {
    const last = transactions[transactions.length - 1];
    if (!last) return;
    this.current = this.view ? this.view.state : last.state;
    if (transactions.some((transaction) => transaction.docChanged)) {
      this.state.revision = this.revision + 1;
      this.state.empty = this.current.doc.length === 0;
      this.emitter.emit("updated", { id: this.id, revision: this.revision });
    }
    this.refresh();
  }

  /** Writes the cursor when it differs from the one held. */
  private refresh(): void {
    const next = cursor(this.current);
    if (same(this.cursor, next)) return;
    this.state.cursor = next;
  }

  /** Whether a span lies within the document. */
  private within(from: number, to: number): boolean {
    const length = this.current.doc.length;
    return from >= 0 && to >= from && to <= length;
  }

  // --- commands --------------------------------------------------------

  run(command: StateCommand): boolean {
    return command({
      state: this.current,
      dispatch: (transaction) => {
        this.apply([transaction]);
      },
    });
  }

  dispatch(...specs: TransactionSpec[]): boolean {
    if (specs.length === 0) return false;
    return this.apply([this.current.update(...specs)]);
  }

  /** Refused when the offset or range lies outside the document. */
  insert(text: string, at?: number | Range): boolean {
    const range: Range =
      at === undefined
        ? this.current.selection.main
        : typeof at === "number"
          ? { from: at, to: at }
          : at;
    if (!this.within(range.from, range.to)) return false;
    const transaction = this.current.update({
      changes: { from: range.from, to: range.to, insert: text },
      selection: { anchor: range.from + text.length },
    });
    if (!transaction.docChanged) return false;
    return this.apply([transaction]);
  }

  /** Refused when the range lies outside the document. */
  select(from: number, to: number = from): boolean {
    if (!this.within(Math.min(from, to), Math.max(from, to))) return false;
    return this.dispatch({ selection: { anchor: from, head: to } });
  }

  /** Refused when history is off: the command finds no history. */
  undo(): boolean {
    return this.run(undo);
  }

  redo(): boolean {
    return this.run(redo);
  }

  // --- element ---------------------------------------------------------

  locate(point: Point): number | null {
    return this.view?.posAtCoords(point) ?? null;
  }

  focus(position?: Position): boolean {
    if (!this.view) return false;
    const length = this.current.doc.length;
    if (position !== undefined) {
      const selection =
        position === "start"
          ? { anchor: 0 }
          : position === "end"
            ? { anchor: length }
            : position === "all"
              ? { anchor: 0, head: length }
              : { anchor: Math.max(0, Math.min(position, length)) };
      this.dispatch({ selection, scrollIntoView: true });
    }
    this.view.focus();
    return true;
  }

  /**
   * Builds the view over the current state and puts its DOM in the
   * element, in place of whatever the element holds. A host that showed
   * the text static shows the editor instead. The view's dispatch settles
   * every transaction, the user's keystrokes included.
   */
  mount(element: HTMLElement): void {
    if (this.view) return;
    const view = new EditorView({
      state: this.current,
      dispatchTransactions: (transactions, target) => {
        target.update(transactions);
        this.settle(transactions);
      },
    });
    element.replaceChildren(view.dom);
    this.view = view;
    this.state.mounted = true;
    this.emitter.emit("mounted", { id: this.id });
  }

  unmount(): void {
    if (!this.view) return;
    this.current = this.view.state;
    this.view.destroy();
    this.view = null;
    this.state.mounted = false;
    this.emitter.emit("unmounted", { id: this.id });
  }

  destroy(): void {
    const mounted = this.view !== null;
    this.view?.destroy();
    this.view = null;
    this.state.mounted = false;
    if (mounted) this.emitter.emit("unmounted", { id: this.id });
  }
}
