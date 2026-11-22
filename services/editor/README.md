# @zoobzio/editor

Headless rich text editor service. Pure TypeScript, no framework
dependency; built on [tiptap](https://tiptap.dev) and ProseMirror.

Owns: one document, the feature set it is edited with, the commands, and
the snapshot a view reads (revision, empty, active marks and nodes,
mounted). Links and inline images are part of the feature set. Delegates: the document's form (`read` and `write`), any nodes
and marks beyond the feature set (`extensions`), and state storage (the
container). The editor builds and runs with no DOM; `mount` attaches it to
an element later.

## Usage

```ts
import { EditorService, createEditorState, hast } from "@zoobzio/editor";

const config = { headings: [1, 2, 3], code: false };

const editor = new EditorService("body", config, createEditorState(), {
  read: hast.read,
  write: hast.write,
});

editor.load(tree); // a hast root, through the reader
editor.run((chain) => chain.setTextSelection({ from: 1, to: 6 }));
editor.toggle("bold"); // marks
editor.block("heading", { level: 2 }); // block nodes, back to a paragraph
editor.wrap("blockquote"); // wrapping nodes
editor.list("bulletList"); // lists
editor.link("https://example.com"); // the selection, or the link the caret is in
editor.attributes("link").href; // what is at the selection
editor.link(null); // removes it
editor.insert({ type: "image", attrs: { src: "/a.png", alt: "A" } });
editor.undo();
editor.can.toggle("bold"); // false inside a code block
editor.can.undo(); // false with nothing to undo
editor.document; // a hast root, through the writer
editor.json; // the editor's own form

editor.mount(element); // in a browser: the element becomes the editor's DOM
editor.focus();
editor.unmount();
```

## Config

Pure data: which features the editor offers. Every feature is on unless
turned off.

| Key          | Off removes                                      |
| ------------ | ------------------------------------------------ |
| `headings`   | headings; a list of levels narrows them          |
| `lists`      | bullet and ordered lists                         |
| `links`      | links; `link()` is refused                       |
| `code`       | inline code and code blocks                      |
| `blockquote` | block quotes                                     |
| `rule`       | the horizontal rule                              |
| `images`     | images                                           |
| `history`    | undo and redo; `undo()` and `redo()` are refused |

## Links and images

`link(href)` sets the link over the selection. With the caret inside a
link the whole link is the target, so one call changes its address; with
the caret in plain text there is nothing to link, and the `href` is
inserted as the link's own text. `link(null)` removes the link, keeping
its text. An `href` whose protocol the link extension does not allow
(`javascript:`) is refused and nothing changes. A click on a link in the
editor places the caret and never follows it.

An image is an inline node holding a `src` and, optionally, an `alt` and a
`title`: `insert({ type: "image", attrs })` adds one at the selection. It
is inline because an image is inline in HTML and in Markdown: `<p>text
<img> text</p>` and `![alt](src)` read and write back as they were, where a
block image would split the paragraph. The editor stores the address and
nothing else; the browser loads it. An app that takes uploads stores the
file itself and inserts the address it gets back. A `data:` address is
dropped on read.

`attributes(name)` reads the attributes of a mark or node at the
selection: a link's `href`, a selected image's `src` and `alt`. It is a
plain read, tied to neither the revision nor the snapshot, for a view to
ask when it opens a prompt.

## Readers and writers

The editor's document is tiptap's JSON. A **reader** turns a source in the
consumer's form into it; a **writer** turns it into the consumer's form.
Both are synchronous, and both receive the editor's `context`: its schema
and extensions, so a transform asks what the editor models and never
guesses. Ingestion and consumption may differ in form.

```ts
type Reader<I> = (source: I, context: Context) => JSONContent;
type Writer<O> = (document: JSONContent, context: Context) => O;
```

The types are the kit's `Step` and `Codec`, bound to the editor's
document and context, as `Middleware` and `Options` are bound to its
container.

## Codecs

The package carries three, each a `Codec` over one form:

| Codec  | Form                                                       | Through         |
| ------ | ---------------------------------------------------------- | --------------- |
| `json` | tiptap's JSON, the editor's own                            | identity        |
| `html` | an HTML string                                             | `@tiptap/html`  |
| `hast` | an HTML tree ([hast](https://github.com/syntax-tree/hast)) | HTML, both ways |

A codec changes representation only. The editor's extensions decide
meaning: each node and mark parses and renders by its own `parseHTML` and
`renderHTML` rules, so a consumer's extension maps because the consumer
registered it, and an element the schema does not model keeps its text and
loses itself. `@tiptap/html` resolves to a browser build or a server build
by export condition, so one import serves both. A tree `hast.write` gives
carries no positions and no parser data.

The kit's `compose` chains the consumer's own steps before or after a
codec. A consumer with a Markdown pipeline of its own reads through it:

```ts
import { compose } from "@zoobzio/kit";
import { hast } from "@zoobzio/editor";

const read = compose(pipeline.build, hast.read); // markdown -> hast -> doc
const write = compose(hast.write, (tree) => summarize(tree)); // doc -> hast -> the consumer's
```

## The state container

The service reads and writes the `state` container: the revision, the
empty flag, the active snapshot, and the mounted flag. The document is not
in it. `document` and `json` read the revision and then read the editor, so
a reactive container recomputes them on every change and a reader that is
not asked costs nothing. `can` mirrors the commands by name as dry runs
(`can.toggle`, `can.block`, `can.wrap`, `can.list`, `can.insert`,
`can.undo`, `can.redo`), each reading the revision and the active snapshot
first, so a toolbar bound to a reactive container disables a tool as the
selection moves.

```ts
createEditorState(); // plain: tests, Node
reactive(createEditorState()); // Vue
useState(`editor-${id}`, () => createEditorState()).value; // Nuxt, shared by id
```

Each service holds its own editor. Two services over one container share
the revision and nothing else, so one mounted editor per id. `load` must
run where the editor runs: a revision carried across SSR says nothing about
the document on the other side. A loaded document is a new beginning: the
history starts over and the selection sits at its start.

`mount` takes its element over rather than appending to it: the element
becomes the editor's DOM and its children are reconciled to the document.
An element that already holds the document's HTML (rendered on the server
through the `html` codec, say) turns editable in place, with no change a
reader can see. A view can therefore show the document static and mount
only when the user interacts.

## Middleware

`options.get.state.<field>` and `options.set.state.<field>` receive the
value of the field and return the value the service uses. A missing slot
passes the value on.

## Events

`on(event, listener)` subscribes. Listeners run in subscription order,
after the write lands. The return value removes the listener.

- `change`: a field of the container was written. `{ field, before, after }`, narrowed by `field`.
- `loaded`: a source replaced the document through the reader. `{ id, revision }`. Not an update, and the history starts over.
- `updated`: the document changed. `{ id, revision }`.
- `mounted`: the editor attached to an element. `{ id }`.
- `unmounted`: the editor left its element, on `unmount` or `destroy`. `{ id }`.

```ts
const off = editor.on("updated", () => autosave(editor.document));
```
