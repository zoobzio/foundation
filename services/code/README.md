# @zoobzio/code

Headless code editor service. Pure TypeScript, no framework dependency;
built on [CodeMirror](https://codemirror.net).

Owns: one text document, the commands, and the snapshot a view reads
(revision, empty, cursor, mounted). Delegates: the document's form (`read`
and `write`), everything CodeMirror decides by extension (`extensions`:
language, theme, highlight style, gutters, keymaps, completion, linting),
and state storage (the container). The editor builds and runs with no DOM;
`mount` attaches a view to an element later.

## Usage

```ts
import { CodeService, createCodeState, text } from "@zoobzio/code";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import { lineNumbers } from "@codemirror/view";

const editor = new CodeService("readme", {}, createCodeState(), {
  ...text,
  extensions: [markdown(), oneDark, lineNumbers()],
});

editor.load("# Title\n\nBody."); // a string, through the reader
editor.select(2, 7);
editor.insert("Heading"); // replaces the selection
editor.insert("\n", editor.text.length); // at an offset
editor.run(indentMore); // any CodeMirror state command
editor.dispatch({ changes: { from: 0, insert: "> " } }); // any transaction
editor.undo();
editor.cursor; // { line, column }, counted from one
editor.document; // the consumer's form, through the writer
editor.text; // the editor's own form

editor.mount(element); // in a browser: the view's DOM replaces the element's content
editor.focus("end");
editor.locate({ x, y }); // the offset under a pointer
editor.unmount();
```

## Config

Pure data: which features the editor offers. Every feature is on unless
turned off.

| Key       | Off removes                                                              |
| --------- | ------------------------------------------------------------------------ |
| `history` | undo and redo, and their key bindings; `undo()` and `redo()` are refused |

Nothing else is a feature. Syntax highlighting, the theme, line numbers,
line wrapping, bracket matching, the default keymap, autocompletion, and
linting are the consumer's CodeMirror extensions, passed through untouched.
The package decides nothing it does not have to.

## Extensions

`extensions` are the consumer's, exactly as CodeMirror takes them. They
come first in the editor's extensions, before the feature set's, so a
consumer's key binding wins over the history keymap. The editor's
`context.extensions` holds the full list.

```ts
const editor = new CodeService("main", { history: true }, state, {
  ...text,
  extensions: [
    javascript({ typescript: true }),
    syntaxHighlighting(myHighlightStyle),
    keymap.of([...defaultKeymap, indentWithTab]),
    EditorView.lineWrapping,
  ],
});
```

## Readers and writers

The editor's document is text. A **reader** turns a source in the
consumer's form into it; a **writer** turns it into the consumer's form.
Both are synchronous, and both receive the editor's `context`. Ingestion
and consumption may differ in form.

```ts
type Reader<I> = (source: I, context: Context) => string;
type Writer<O> = (document: string, context: Context) => O;
```

The types are the kit's `Step` and `Codec`, bound to the editor's text and
context. The package carries one codec, `text`: the editor's own form in
and out, through identity. The kit's `compose` chains the consumer's steps
before or after it.

```ts
import { compose } from "@zoobzio/kit";
import { text } from "@zoobzio/code";

const read = compose((file: File) => file.body, text.read);
const write = compose(text.write, (source) => ({ ...file, body: source }));
```

A consumer who edits one source as prose or as code holds two services
over one form and picks one: `@zoobzio/editor` reads it through a Markdown
pipeline, this service reads it as is. Neither knows about the other.

## Commands

| Call                 | Does                                                          |
| -------------------- | ------------------------------------------------------------- |
| `run(command)`       | runs a CodeMirror `StateCommand`; `undo` and `redo` are two   |
| `dispatch(...specs)` | applies transaction specs as one transaction                  |
| `insert(text, at?)`  | replaces the selection, inserts at an offset, or over a range |
| `select(from, to?)`  | moves the selection                                           |
| `undo()` / `redo()`  | walk the history; refused when history is off                 |

`insert` and `select` are refused outside the document and return `false`.

## The state container

The service reads and writes the `state` container: the revision, the
empty flag, the cursor, and the mounted flag. The document is not in it.
`document` and `text` read the revision and then read the editor, so a
reactive container recomputes them on every change and a reader that is
not asked costs nothing.

```ts
createCodeState(); // plain: tests, Node
reactive(createCodeState()); // Vue
useState(`code-${id}`, () => createCodeState()).value; // Nuxt, shared by id
```

Each service holds its own CodeMirror state. Two services over one
container share the revision and nothing else, so one mounted editor per
id. `load` must run where the editor runs.

`mount` builds the view over the current state and puts its DOM in the
element, in place of whatever the element holds. A host that showed the
text static (in a `pre`, say, rendered on the server) shows the editor
instead; the text is the same, the DOM is CodeMirror's. A view can
therefore show the text static and mount only when the user interacts.
`locate` gives the offset under the pointer that asked, so the caret lands
where the user clicked.

## Middleware

`options.get.state.<field>` and `options.set.state.<field>` receive the
value of the field and return the value the service uses. A missing slot
passes the value on.

## Events

`on(event, listener)` subscribes. Listeners run in subscription order,
after the write lands. The return value removes the listener.

- `change`: a field of the container was written. `{ field, before, after }`, narrowed by `field`.
- `loaded`: a source replaced the document through the reader. `{ id, revision }`. Not an update, and the history starts over.
- `updated`: the document changed, by a command or a keystroke. `{ id, revision }`.
- `mounted`: the editor attached to an element. `{ id }`.
- `unmounted`: the editor left its element, on `unmount` or `destroy`. `{ id }`.

```ts
const off = editor.on("updated", () => autosave(editor.document));
```
