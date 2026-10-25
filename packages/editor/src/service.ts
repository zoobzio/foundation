import type {
  Actions,
  Active,
  Config,
  Context,
  Event,
  Events,
  Listener,
  Options,
  Service,
  State,
} from "./types";
import type { Emitter } from "@zoobzio/kit";
import type { ChainedCommands, Extensions, JSONContent } from "@tiptap/core";

import { Editor } from "@tiptap/core";
import { StarterKit } from "@tiptap/starter-kit";
import { makeEmitter, makeProxy } from "@zoobzio/kit";
import {
  EDITOR_BLOCK_FALLBACK,
  EDITOR_EMPTY_DOCUMENT,
  EDITOR_LIST_ITEM,
  EDITOR_STATE_FIELDS,
} from "./constants";
import { features, same, snapshot } from "./util";

/**
 * The headless editor machine. Owns one tiptap editor, built from the
 * feature set and the consumer's extensions, with no element: the editor
 * holds the document and runs the commands with no DOM, and `mount`
 * attaches it to one later. Delegates the document's form to `actions`:
 * the reader turns a source into the editor's document, the writer turns
 * the editor's document into the consumer's.
 *
 * The service reads and writes the `state` container through the `options`
 * middleware. The container holds the revision, the empty flag, the active
 * snapshot, and the mounted flag, never the document. Each write emits
 * `change`; the lifecycle emits `loaded`, `updated`, `mounted`, and
 * `unmounted`. `on` subscribes.
 */
export class EditorService<I, O> implements Service<I, O> {
  public readonly config: Config;
  public readonly context: Context;

  private readonly state: State;
  private readonly editor: Editor;
  private readonly emitter: Emitter<Events> = makeEmitter();

  constructor(
    public readonly id: string,
    config: Config,
    state: State,
    private readonly actions: Actions<I, O>,
    options: Options = {},
  ) {
    this.config = Object.freeze({ ...config });
    this.state = makeProxy(state, EDITOR_STATE_FIELDS, options, this.emitter);

    const extensions: Extensions = [
      StarterKit.configure(features(config)),
      ...(actions.extensions ?? []),
    ];
    this.editor = new Editor({
      element: null,
      extensions,
      content: EDITOR_EMPTY_DOCUMENT,
      injectCSS: false,
    });
    this.context = { schema: this.editor.schema, extensions };
    this.attach();

    // A non-extensible object is never wrapped by a reactive proxy (Vue
    // skips non-extensible targets), so the editor stays raw however the
    // consumer holds the service. ProseMirror and the DOM observers it owns
    // use private fields, which a proxy cannot reach.
    Object.preventExtensions(this);

    this.editor.on("update", () => {
      this.state.revision = this.revision + 1;
      this.state.empty = this.editor.isEmpty;
      this.emitter.emit("updated", { id: this.id, revision: this.revision });
    });
    this.editor.on("transaction", () => {
      this.refresh();
    });
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
  get active(): Active {
    return this.state.active;
  }
  get mounted(): boolean {
    return this.state.mounted;
  }

  // --- document --------------------------------------------------------

  get json(): JSONContent {
    return this.at(this.revision, () => this.editor.getJSON());
  }

  get document(): O {
    return this.actions.write(this.json, this.context);
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
   * loaded document is a new beginning, not an edit to undo.
   */
  load(source: I): void {
    const content = this.actions.read(source, this.context);
    this.editor.commands.setContent(content, { emitUpdate: false });
    this.attach(true);
    this.state.revision = this.revision + 1;
    this.state.empty = this.editor.isEmpty;
    this.refresh();
    this.emitter.emit("loaded", { id: this.id, revision: this.revision });
  }

  /**
   * Attaches the extensions' plugins to the state. Tiptap builds a headless
   * state with no plugins and attaches them when a view is created; the
   * service attaches them at once, so history and the other document-level
   * plugins run before any mount, and the same with none. With `reset`,
   * the plugins are dropped first, so each starts over.
   */
  private attach(reset = false): void {
    const plugins = this.editor.extensionManager.plugins;
    const state = reset
      ? this.editor.state.reconfigure({ plugins: [] })
      : this.editor.state;
    this.editor.view.updateState(state.reconfigure({ plugins }));
  }

  /** Writes the active snapshot when it differs from the one held. */
  private refresh(): void {
    const next = snapshot(this.editor);
    if (same(this.active, next)) return;
    this.state.active = next;
  }

  // --- commands --------------------------------------------------------

  toggle(mark: string, attrs?: Record<string, unknown>): boolean {
    return this.editor.commands.toggleMark(mark, attrs);
  }

  block(node: string, attrs?: Record<string, unknown>): boolean {
    return this.editor.commands.toggleNode(node, EDITOR_BLOCK_FALLBACK, attrs);
  }

  wrap(node: string, attrs?: Record<string, unknown>): boolean {
    return this.editor.commands.toggleWrap(node, attrs);
  }

  list(node: string): boolean {
    return this.editor.commands.toggleList(node, EDITOR_LIST_ITEM);
  }

  insert(content: JSONContent | JSONContent[]): boolean {
    return this.editor.commands.insertContent(content);
  }

  /** Refused when history is off: the commands are not there. */
  undo(): boolean {
    const { undo } = this.editor.commands;
    return typeof undo === "function" ? undo() : false;
  }

  redo(): boolean {
    const { redo } = this.editor.commands;
    return typeof redo === "function" ? redo() : false;
  }

  run(commands: (chain: ChainedCommands) => ChainedCommands): boolean {
    return commands(this.editor.chain()).run();
  }

  isActive(name: string, attrs?: Record<string, unknown>): boolean {
    return this.editor.isActive(name, attrs);
  }

  // --- element ---------------------------------------------------------

  focus(position?: "start" | "end" | "all" | number): boolean {
    if (!this.mounted) return false;
    return this.editor.commands.focus(position);
  }

  /**
   * Takes the element over: the element itself becomes the editor's DOM,
   * and whatever it holds is reconciled to the document rather than
   * appended to. A host that already shows the document's HTML, say from
   * the server, turns editable in place with no visible change.
   */
  mount(element: HTMLElement): void {
    this.editor.mount({ mount: element });
    this.state.mounted = true;
    this.emitter.emit("mounted", { id: this.id });
  }

  unmount(): void {
    if (!this.mounted) return;
    this.editor.unmount();
    this.state.mounted = false;
    this.emitter.emit("unmounted", { id: this.id });
  }

  destroy(): void {
    const mounted = this.mounted;
    this.editor.destroy();
    this.state.mounted = false;
    if (mounted) this.emitter.emit("unmounted", { id: this.id });
  }
}
