# @zoobzio/prose

## 0.1.7

## 0.1.6

## 0.1.5

## 0.1.4

### Patch Changes

- [`16cde38`](https://github.com/zoobzio/foundation/commit/16cde38403b100b642cbaaa9c47320e60dc4829b) Thanks [@zoobzio](https://github.com/zoobzio)! - The Nuxt layer resolves a label where the component renders it. Every component of `@zoobzio/vue` now exposes a slot around each text it draws — the select's and multi-select's `itemLabel`, the listbox's `itemLabel`, the tabs' and the accordion's `triggerLabel`, the hero's `actionLabel`, the form field's `labelText` and `hintText`, the tree's `itemText`, and the date filters' `fieldLabel`, `operatorLabel` and `valueLabel` over a context that carries the stepper's `field`, `operator` and `value` — and the select, multi-select and autocomplete leave an item's typeahead text to what the item renders. The layer's wrappers fill those slots with the text in the visitor's locale and hand their props through untouched, save a scalar the component gives to an attribute (a placeholder, an accessible name); the `texts` helper that resolved a wrapper's props by walking them is gone. The factories resolve the whole config of a table, browser or form in one call, rather than the columns, actions and fields by name, so a text anywhere in the config — a literal's label, say — resolves as a column's does; the form's `defaults`, the payload's values, stand as given. Two defaults the headless packages ship in English have messages in `@zoobzio/prose` and are laid under the config when it names none: `table.text`, the label of the query's text literal, and `browser.root`, the label of the browser's root crumb. `@zoobzio/browser` carries `rootLabel` and a crumb's `label` as `Text`, as it carries a column's.

## 0.1.3

### Patch Changes

- [`4d53efc`](https://github.com/zoobzio/foundation/commit/4d53efcc827acf43f31378d48d4695a7dbc581ad) Thanks [@zoobzio](https://github.com/zoobzio)! - Add `@zoobzio/prose`, the text of the design system: every label, placeholder and notice the components render by default, authored as FormatJS messages and built by `@prosary/kit` into a typed contract and a bundle per locale. The kit's new `Text` type is what a service or a component carries wherever it carried a label: `string`, until a layer widens it by merging into `TextMap`. The packages and the vue components change in type alone, and render text as they did. `wrap` of `@zoobzio/vue` takes a `props` map, laid under the consumer's props on each render; the bulk-action bars, the column manager and the editor's tools gain a slot around their text, and the date filters' context carries its step and apply. The Nuxt layer loads `@prosary/nuxt` with the prose build as its `prosary.build`, widens `Text` to the app's whole contract, and resolves every message at its boundary: its wrappers resolve the data they are handed and supply the components' defaults from the contract through `pt`, slots and `props`; its factories resolve the labels of a service's columns, actions and fields as the service is built; and its `locale` plugin reloads the app on a switch. The error page, the request defaults and the app's fallback notification read from the contract too.
