# @zoobzio/editor

## 0.1.9

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.9

## 0.1.8

### Patch Changes

- [`f8f59b3`](https://github.com/zoobzio/foundation/commit/f8f59b3ba0a43f5b305a058a9348c1d211d04e58) Thanks [@zoobzio](https://github.com/zoobzio)! - The editor's toolbar behaves as a rich text editor's. The service puts the selection at the start of a loaded document, as a fresh editor's is, rather than at the end where tiptap's replace left it, so a toolbar bound before the user interacts reflects the document's start; `insert` after `load` now inserts there. The service gains `can`, a dry run of each command by name (`can.toggle`, `can.block`, `can.wrap`, `can.list`, `can.insert`, `can.undo`, `can.redo`) that reads the revision and the active snapshot, so a reactive toolbar disables a tool as the selection moves. The vue editor renders its toolbar on reka's toolbar root, one tab stop with arrow-key focus between the controls and a separator between groups (the block type, marks, lists, blocks, history); the headings are one dropdown, the package's Menu over the paragraph and the heading levels, whose trigger names the block at the selection (`pt.block`, the `block`, `blockLabel`, `blockAppend`, and `blockItemLabel` slots, `blocks` and `block` on the context and from `useEditor`), and a menu item now takes HTML attributes through `pt.item`; each tool is a Fab part with the tool's label as its accessible name, a toggle reports `aria-pressed` and an action never does, a press keeps focus in the document, and a tool is disabled where its command would not apply. `EditorTool` carries `kind` and `group`; the context and `useEditor` carry `groups`; `pt.separator` and the `separator` slot are new. The nuxt layer's editor and rich text wrappers draw each tool's icon in place of its text, so the toolbar is icon-only, with the label in the visitor's locale as the button's `aria-label` and `title`, and read the block type dropdown in the visitor's locale with the `expand` icon after its text; the heading message reads `Heading {level}` and `editor.paragraph` is new. The layer's `nuxt.config` defines `navigator` for the server build as the runtime's own: Nuxt's default, `undefined`, crashed tiptap as the editor was constructed on the server in a production build. The layer also leaves `objectively` out of Vite's dev pre-bundle: Vite keys a pre-bundled dependency by its bare name, and `@untheme` and `@icon-sheets` pin older versions than the layer and `@zoobzio/vue` import, so in dev whichever version Vite met first was served to every importer and a page could fail on a missing export. A new `examples/nuxt` app renders the editor on one page with a mock stylesheet, run with `pnpm example:nuxt`.

- Updated dependencies []:
  - @zoobzio/kit@0.1.8

## 0.1.7

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.7

## 0.1.6

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.6

## 0.1.5

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.5

## 0.1.4

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.4

## 0.1.3

### Patch Changes

- Updated dependencies [[`4d53efc`](https://github.com/zoobzio/foundation/commit/4d53efcc827acf43f31378d48d4695a7dbc581ad)]:
  - @zoobzio/kit@0.1.3

## 0.1.2

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.2

## 0.1.1

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.1

## 0.1.0

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.0

## 0.0.15

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.15

## 0.0.14

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.14

## 0.0.13

### Patch Changes

- Updated dependencies [[`bf27e77`](https://github.com/zoobzio/foundation/commit/bf27e77fa3b8344d7999acd2f1a4f9ee53cad802)]:
  - @zoobzio/kit@0.0.13

## 0.0.12

### Patch Changes

- Updated dependencies [[`0c7ba4d`](https://github.com/zoobzio/foundation/commit/0c7ba4db69e3457c90cbe296e1132fb65cdfdce4)]:
  - @zoobzio/kit@0.0.12

## 0.0.11

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.11

## 0.0.10

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.10

## 0.0.9

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.9

## 0.0.8

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.8

## 0.0.7

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.7

## 0.0.6

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.6

## 0.0.5

### Patch Changes

- [`8834379`](https://github.com/zoobzio/foundation/commit/8834379594010041bc4bb272c4a87add3ba97265) Thanks [@zoobzio](https://github.com/zoobzio)! - feat: headless rich text editor service over tiptap with json, html, and hast codecs; codec and compose in the kit

- [`946e44d`](https://github.com/zoobzio/foundation/commit/946e44d0ad3dccf9f08ab5c3f90ad5a169736668) Thanks [@zoobzio](https://github.com/zoobzio)! - feat: mount takes its element over, so a host that already shows the document turns editable in place

- Updated dependencies [[`8834379`](https://github.com/zoobzio/foundation/commit/8834379594010041bc4bb272c4a87add3ba97265)]:
  - @zoobzio/kit@0.0.5
