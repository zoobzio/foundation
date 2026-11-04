# @zoobzio/kit

## 0.1.5

## 0.1.4

## 0.1.3

### Patch Changes

- [`4d53efc`](https://github.com/zoobzio/foundation/commit/4d53efcc827acf43f31378d48d4695a7dbc581ad) Thanks [@zoobzio](https://github.com/zoobzio)! - Add `@zoobzio/prose`, the text of the design system: every label, placeholder and notice the components render by default, authored as FormatJS messages and built by `@prosary/kit` into a typed contract and a bundle per locale. The kit's new `Text` type is what a service or a component carries wherever it carried a label: `string`, until a layer widens it by merging into `TextMap`. The packages and the vue components change in type alone, and render text as they did. `wrap` of `@zoobzio/vue` takes a `props` map, laid under the consumer's props on each render; the bulk-action bars, the column manager and the editor's tools gain a slot around their text, and the date filters' context carries its step and apply. The Nuxt layer loads `@prosary/nuxt` with the prose build as its `prosary.build`, widens `Text` to the app's whole contract, and resolves every message at its boundary: its wrappers resolve the data they are handed and supply the components' defaults from the contract through `pt`, slots and `props`; its factories resolve the labels of a service's columns, actions and fields as the service is built; and its `locale` plugin reloads the app on a switch. The error page, the request defaults and the app's fallback notification read from the contract too.

## 0.1.2

## 0.1.1

## 0.1.0

## 0.0.15

## 0.0.14

## 0.0.13

### Patch Changes

- [`bf27e77`](https://github.com/zoobzio/foundation/commit/bf27e77fa3b8344d7999acd2f1a4f9ee53cad802) Thanks [@zoobzio](https://github.com/zoobzio)! - Version bump.

## 0.0.12

### Patch Changes

- [`0c7ba4d`](https://github.com/zoobzio/foundation/commit/0c7ba4db69e3457c90cbe296e1132fb65cdfdce4) Thanks [@zoobzio](https://github.com/zoobzio)! - Re-release after failed publish.

## 0.0.11

## 0.0.10

## 0.0.9

## 0.0.8

## 0.0.7

## 0.0.6

## 0.0.5

### Patch Changes

- [`8834379`](https://github.com/zoobzio/foundation/commit/8834379594010041bc4bb272c4a87add3ba97265) Thanks [@zoobzio](https://github.com/zoobzio)! - feat: headless rich text editor service over tiptap with json, html, and hast codecs; codec and compose in the kit

## 0.0.4

## 0.0.3

## 0.0.2

## 0.0.1

### Patch Changes

- [`00314f2`](https://github.com/zoobzio/foundation/commit/00314f2819555e2681b5739510aaa7ecb3c4c356) Thanks [@zoobzio](https://github.com/zoobzio)! - Initial alpha release: the headless services (`kit`, `query`, `browser`, `form`, `table`), the Vue components, and the Nuxt layer.
