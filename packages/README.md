# packages/

Framework-free TypeScript packages. The headless services each own a data
machine and delegate data loading and state storage to the caller; the
mechanisms they share (the event emitter, the state container proxy, and their
types) live in [`@zoobzio/kit`](./kit/).

| Package                          | Description                                                                                                                               |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| [`@zoobzio/kit`](./kit/)         | Shared kit: typed event emitter, state container proxy, codec and compose, and their types                                                |
| [`@zoobzio/query`](./query/)     | Query service: committed text and field filters over a field schema, plus a draft that composes them                                      |
| [`@zoobzio/browser`](./browser/) | Browser service: folder trail navigation, file sort, selection, action joins                                                              |
| [`@zoobzio/form`](./form/)       | Form service: payload, per-key validation, touched tracking, submit lifecycle                                                             |
| [`@zoobzio/table`](./table/)     | Table service: paging, sort, selection, column order, search filters                                                                      |
| [`@zoobzio/editor`](./editor/)   | Editor service: one rich text document over tiptap, a feature set, commands, json/html/hast codecs                                        |
| [`@zoobzio/code`](./code/)       | Code service: one text document over CodeMirror, history, the consumer's extensions, text codec                                           |
| [`@zoobzio/icons`](./icons/)     | Icon contract: the roles the components leave to their icon slots, built by icon-sheets into a typed alias union, a contract, and sprites |
| [`@zoobzio/theme`](./theme/)     | Theme: the aurora preset of untheme with the foundation palette as its base and the shell's roles, built by @untheme/kit into a preset    |

Each package has its own README with usage, the state container contract,
middleware, and events. The editor and the code service are the two backed
by a dependency: the editor owns a tiptap editor with no DOM, and its codecs
turn the documents a consumer holds into the editor's and back; the code
service owns a CodeMirror state with no view, and the consumer's own
CodeMirror extensions decide language, theme, and keymaps. The table, the form, and the browser render through
[`@zoobzio/vue`](../integrations/vue/), and their Nuxt wiring lives in
[`@zoobzio/nuxt`](../integrations/nuxt/) as `stores/<name>.ts` and
`factories/<name>.ts`.
