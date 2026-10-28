# @zoobzio/vue

## 0.0.7

### Patch Changes

- [`930baaa`](https://github.com/zoobzio/foundation/commit/930baaaa0f1f8570638f1e5c307ab98116b99c94) Thanks [@zoobzio](https://github.com/zoobzio)! - Add three field types to the form: `file` (a `File`), `multi-file` (a `File[]`), and `richtext` (the document as an HTML string, with `features` as the editor's feature set). The form field renders the first two through a new `file-input.vue`, a native file input with the picked files listed beneath it and a remove button on each, whose model is the list of files; it renders `richtext` through a new `rich-text.vue`, a v-model over an HTML string with an `@zoobzio/editor` service the component owns behind it, rendered through `editor.vue`. An edit writes the document through the `html` codec (`""` when the document is empty, so `z.string().min(1)` marks a required field), and a model write from outside replaces the document. The Nuxt layer registers both components, their `define*` constructors, and their types.

- Updated dependencies [[`930baaa`](https://github.com/zoobzio/foundation/commit/930baaaa0f1f8570638f1e5c307ab98116b99c94)]:
  - @zoobzio/form@0.0.7
  - @zoobzio/kit@0.0.7
  - @zoobzio/query@0.0.7
  - @zoobzio/browser@0.0.7
  - @zoobzio/table@0.0.7
  - @zoobzio/editor@0.0.7
  - @zoobzio/code@0.0.7

## 0.0.6

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.6
  - @zoobzio/query@0.0.6
  - @zoobzio/browser@0.0.6
  - @zoobzio/form@0.0.6
  - @zoobzio/table@0.0.6
  - @zoobzio/editor@0.0.6
  - @zoobzio/code@0.0.6

## 0.0.5

### Patch Changes

- [`e8e8463`](https://github.com/zoobzio/foundation/commit/e8e8463b8df736801cdcd6ca5a1020ee99661c71) Thanks [@zoobzio](https://github.com/zoobzio)! - feat: code component and useCode composable over the headless code service, static until the user interacts, with its Nuxt store, factory, and hooks

- [`946e44d`](https://github.com/zoobzio/foundation/commit/946e44d0ad3dccf9f08ab5c3f90ad5a169736668) Thanks [@zoobzio](https://github.com/zoobzio)! - feat: editor component and useEditor composable over the headless editor service, static until the user interacts, with its Nuxt store, factory, and hooks

- [`a684eb7`](https://github.com/zoobzio/foundation/commit/a684eb7a6a7c1cc75c5266d86dac7b0a53c9f069) Thanks [@zoobzio](https://github.com/zoobzio)! - Add `tel` and `url` to the text field types, and a `TemporalField` for native string date and time inputs: `time`, `datetime-local`, and `date-input`, which renders `<input type="date">` with a `YYYY-MM-DD` string value. The `date` type stays the `Date`-valued picker. The form field now forwards `maxLength` on text and textarea fields, `minDate` and `maxDate` on date fields, and `required` on checkbox, multi-select, date, and tags-input fields. The date picker gains `required`, `minValue`, and `maxValue` props, and the multi-select and tags input gain `required`.

- Updated dependencies [[`e8e8463`](https://github.com/zoobzio/foundation/commit/e8e8463b8df736801cdcd6ca5a1020ee99661c71), [`8834379`](https://github.com/zoobzio/foundation/commit/8834379594010041bc4bb272c4a87add3ba97265), [`946e44d`](https://github.com/zoobzio/foundation/commit/946e44d0ad3dccf9f08ab5c3f90ad5a169736668), [`a684eb7`](https://github.com/zoobzio/foundation/commit/a684eb7a6a7c1cc75c5266d86dac7b0a53c9f069), [`0c850a2`](https://github.com/zoobzio/foundation/commit/0c850a2c743a548ea9f42e42984c3580ecb289dd)]:
  - @zoobzio/code@0.0.5
  - @zoobzio/kit@0.0.5
  - @zoobzio/editor@0.0.5
  - @zoobzio/form@0.0.5
  - @zoobzio/browser@0.0.5
  - @zoobzio/query@0.0.5
  - @zoobzio/table@0.0.5

## 0.0.4

### Patch Changes

- [`0b68b05`](https://github.com/zoobzio/foundation/commit/0b68b05c8c0798ebb23944a5b90d2bb1a233bf51) Thanks [@zoobzio](https://github.com/zoobzio)! - Add `typesVersions` mirroring the `exports` map so `@zoobzio/vue/*` subpaths resolve under TypeScript's legacy node10 module resolution. `@vue/compiler-sfc` falls back to node10 when it finds no `tsconfig.json` near a compiled SFC, which made `nuxi build` fail in consumers of `@zoobzio/nuxt` with `Failed to resolve import source "@zoobzio/vue/types/..."`.

- Updated dependencies []:
  - @zoobzio/kit@0.0.4
  - @zoobzio/query@0.0.4
  - @zoobzio/browser@0.0.4
  - @zoobzio/form@0.0.4
  - @zoobzio/table@0.0.4

## 0.0.3

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.3
  - @zoobzio/query@0.0.3
  - @zoobzio/browser@0.0.3
  - @zoobzio/form@0.0.3
  - @zoobzio/table@0.0.3

## 0.0.2

### Patch Changes

- [`bfcac44`](https://github.com/zoobzio/foundation/commit/bfcac44da97192a29931450ae82bef3539006684) Thanks [@zoobzio](https://github.com/zoobzio)! - Links render through a `link` passthrough part, and per-item passthrough merges.

  - `merge` composes a consumer's function part with the local recipe: both run with the same argument and the consumer's result merges over the local one, so `pt.item = () => ({ a })` no longer drops the recipe's other keys. Listeners inside a part still replace. `PT` admits a deep-partial return from a function part to match.
  - Every anchor is now a `link` part rendered through reka's `Primitive`, typed as `LinkProps` (`as`, `asChild`, and the anchor attributes). A consumer swaps the element with `pt.link`, for example `{ link: () => ({ as: NuxtLink }) }`; the recipe's `href` and `target` carry over. Covers `Breadcrumb`, `Directory`, `Tree`, `Tabs`, `SegmentedControl`, `Menu`, the `url` cells of `TableBody` and `BrowserFiles`, and the `Hero` action.
  - `Breadcrumb` and `Directory` gain a `pt` prop and `settings` on their context. `TableBodyPassthrough` and `BrowserFilesPassthrough` are generic over the row type.
  - `Hero`'s `action` navigates: it renders as an anchor over its `Link` instead of an inert button, and its `button` slot is renamed `action`.

- [`11569ca`](https://github.com/zoobzio/foundation/commit/11569cac7b307f2b3c95a6c912dbd128d0dc7368) Thanks [@zoobzio](https://github.com/zoobzio)! - `usePassthrough`, `useContext`, and `useExplicit` serve a wrapper.

  - `usePassthrough({ pt, layer })` lays a partial manifest under the consumer's `pt` and returns the layered partial, for a wrapper to hand on as the wrapped component's `pt`. A function part composes as it does over recipes. `PassthroughLayer` types the source; `layer` in `utils/passthrough` is the merge.
  - `useContext(source)` forwards a wrapped component's context unchanged, `undefined` until it mounts.
  - `useExplicit(props)` projects the props the consumer passed explicitly, read off the vnode, so a wrapper hands them on without casting an absent boolean to `false` or turning a model controlled. `explicit` and `isExplicit` in `utils/explicit` are the projection and the presence check; `useModel`'s `explicit` option uses the latter.
  - `PT` keeps a constructor whole, as it does an array, so a component passed through `as` keeps its signature. A `DefineComponent` such as `NuxtLink` now typechecks as a `pt.link` override.

- [`11569ca`](https://github.com/zoobzio/foundation/commit/11569cac7b307f2b3c95a6c912dbd128d0dc7368) Thanks [@zoobzio](https://github.com/zoobzio)! - `@zoobzio/vue` ships declarations. `build` emits `.d.ts` for every source file, `.vue.d.ts` beside each component, into `.dist`, and the exports map serves them under the `types` condition while `default` stays on the source. A consumer's typecheck resolves real declaration files, so a pnpm workspace link no longer loads the package twice, and `skipLibCheck` covers it.

- Updated dependencies []:
  - @zoobzio/kit@0.0.2
  - @zoobzio/query@0.0.2
  - @zoobzio/browser@0.0.2
  - @zoobzio/form@0.0.2
  - @zoobzio/table@0.0.2

## 0.0.1

### Patch Changes

- [`00314f2`](https://github.com/zoobzio/foundation/commit/00314f2819555e2681b5739510aaa7ecb3c4c356) Thanks [@zoobzio](https://github.com/zoobzio)! - Initial alpha release: the headless services (`kit`, `query`, `browser`, `form`, `table`), the Vue components, and the Nuxt layer.

- Updated dependencies [[`00314f2`](https://github.com/zoobzio/foundation/commit/00314f2819555e2681b5739510aaa7ecb3c4c356)]:
  - @zoobzio/kit@0.0.1
  - @zoobzio/query@0.0.1
  - @zoobzio/browser@0.0.1
  - @zoobzio/form@0.0.1
  - @zoobzio/table@0.0.1
