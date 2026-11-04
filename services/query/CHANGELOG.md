# @zoobzio/query

## 0.1.6

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.6

## 0.1.5

### Patch Changes

- [`eb3ec99`](https://github.com/zoobzio/foundation/commit/eb3ec9958b5091dc05bbee9d170056a7ef283697) Thanks [@zoobzio](https://github.com/zoobzio)! - `dateValues(timeZone, now)` of `@zoobzio/query` is a values provider for a field that filters on a date: it generates `YYYY-MM-DD` days from the term, so a visitor always has an option to pick as long as the term is date syntax. An empty term lists the last 31 days, today first, as the day reads in `timeZone`; a partial year narrows those; a full year lists its days newest first, 31 at most; a month lists its days; a partial day the days of the month that match; a complete day stands alone; and a day that does not exist, or a term that is not date syntax, lists nothing. Every option is a whole day, as choosing one commits the filter; years and months may lie in the future, and only the empty term looks back from today. `QUERY_DATE_VALUES_LIMIT` is the window and the cap. The table applies it by default to every `date` and `datetime` column that declares no `values` of its own, reading today in the config's `timeZone`; a column's own `values` replace it. The query machine, the autocomplete and the components change nothing: the provider is the seam `values` already offered.

- Updated dependencies []:
  - @zoobzio/kit@0.1.5

## 0.1.4

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.1.4

## 0.1.3

### Patch Changes

- [`4d53efc`](https://github.com/zoobzio/foundation/commit/4d53efcc827acf43f31378d48d4695a7dbc581ad) Thanks [@zoobzio](https://github.com/zoobzio)! - Add `@zoobzio/prose`, the text of the design system: every label, placeholder and notice the components render by default, authored as FormatJS messages and built by `@prosary/kit` into a typed contract and a bundle per locale. The kit's new `Text` type is what a service or a component carries wherever it carried a label: `string`, until a layer widens it by merging into `TextMap`. The packages and the vue components change in type alone, and render text as they did. `wrap` of `@zoobzio/vue` takes a `props` map, laid under the consumer's props on each render; the bulk-action bars, the column manager and the editor's tools gain a slot around their text, and the date filters' context carries its step and apply. The Nuxt layer loads `@prosary/nuxt` with the prose build as its `prosary.build`, widens `Text` to the app's whole contract, and resolves every message at its boundary: its wrappers resolve the data they are handed and supply the components' defaults from the contract through `pt`, slots and `props`; its factories resolve the labels of a service's columns, actions and fields as the service is built; and its `locale` plugin reloads the app on a switch. The error page, the request defaults and the app's fallback notification read from the contract too.

- Updated dependencies [[`4d53efc`](https://github.com/zoobzio/foundation/commit/4d53efcc827acf43f31378d48d4695a7dbc581ad)]:
  - @zoobzio/kit@0.1.3

## 0.1.2

### Patch Changes

- [`cc42cba`](https://github.com/zoobzio/foundation/commit/cc42cba367086ee88c132c2cb7a12cd97593210e) Thanks [@zoobzio](https://github.com/zoobzio)! - The query's text stage is generalized into literals: a value typed between its own `open` and `close` characters, with a label for its option and no stage to suggest from. The config's `literals` are keyed as its fields are, and default to the text literal alone, `text`: free text between quotes under `Search`, the one `text` reads, so a word that is also a field's label is never taken for one. The field panel leads with the literal options while nothing is typed; selecting one writes its `open` before the term typed so far. The literal stage is terminal: it suggests nothing and adds no trail, so the panels are empty while the literal is typed and a panel view closes, where the text stage held its option open in the trail. Typing the `close` commits the literal at once, as Enter does an unclosed one; a bare term submits nothing, as it names a field still. A literal entry is `{ kind: "literal", key, value }`, one held per key, in place of the `text` entry kind; `textFor` of one is its value between the characters, the string `labelFor` gives and `unwrap` hands back minus the last character. `literals: {}` replaces `text: false`: there is no literal option and a quote is a character. `Literal` is an interface a layer may widen, its other properties carried onto its option as a field's are; `QUERY_TEXT_LITERAL`, `QUERY_LITERALS`, and `QUERY_TEXT_KEY` replace the quote and label constants. The table's config takes `literals` in place of `textLabel` and hands them to its query. The vue autocomplete renders nothing, not even its empty state, in a literal stage. The nuxt layer widens `Literal` with `icon`, draws `search` before a literal option that names none, and no arrow after one, as it is terminal.

- Updated dependencies []:
  - @zoobzio/kit@0.1.2

## 0.1.1

### Patch Changes

- [`adbb87f`](https://github.com/zoobzio/foundation/commit/adbb87fb4086243d843b7c981a5e7b84cd58a62b) Thanks [@zoobzio](https://github.com/zoobzio)! - Free text is quoted in the query's draft: `"text"` is the text stage beside `Label: op term`, so a word that is also a field's label is never taken for a search. The field panel leads with the text option, labelled `Search` or the config's `textLabel`, while nothing is typed; selecting it opens the quote before the term typed so far, and while the draft is quoted it is the active trail option, so selecting it again steps back out. The closing quote commits the text at once, as Enter does an unclosed one. A bare term submits nothing: it names a field still. `textFor` of a text entry is its quoted text, the same string `labelFor` gives and `unwrap` hands back minus the closing quote. With `text: false` there is no text option and a quote is a character. The table's config takes `textLabel` and hands it to its query. The nuxt layer's autocomplete draws the `search` icon before the text option, and `next` after it as after any option that enters a stage.

- Updated dependencies []:
  - @zoobzio/kit@0.1.1

## 0.1.0

### Patch Changes

- [`83b3439`](https://github.com/zoobzio/foundation/commit/83b3439176a69479e567f86aa18d4bce1db5ed2d) Thanks [@zoobzio](https://github.com/zoobzio)! - The draft grammar is `Label: op term`: an operator is followed by a space, not a second colon, so a draft reads as its chip does. The operator is read once its space is typed and matched without case, longest first, so a multi-word operator is reached. The hint after an operator ends in a space; after a field it still ends in `: `. `labelFor` is the entry's text, so a chip's label and the draft that made it are the same string.

- Updated dependencies []:
  - @zoobzio/kit@0.1.0

## 0.0.15

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.15

## 0.0.14

### Patch Changes

- [`16696d8`](https://github.com/zoobzio/foundation/commit/16696d8c380ba97166cbfc1a0e29eac2eddfe4a2) Thanks [@zoobzio](https://github.com/zoobzio)! - `Field` and `Option` of the query are interfaces, so a layer may widen them by declaration merging, and a field's properties beyond the ones the query reads are carried onto its option in the panel and the trail. The nuxt layer widens both with `icon: IconAlias`, so a field given an `icon` draws it before its option in the autocomplete, and draws the branch arrows: `next` after a field or operator option, as selecting it enters a stage, `expand` after the active trail option, as its stage is the one open, and none after a value, as it commits. `@zoobzio/query` is a dependency of the layer.

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

- [`8145080`](https://github.com/zoobzio/foundation/commit/81450806518eccb6131f2c7e02bb0a87bc85128a) Thanks [@zoobzio](https://github.com/zoobzio)! - A field's `values` may be a provider, `(term) => string[]`, beside a list: the value stage gives it the term, so the suggestions can be built from what is typed. A provider's result stands as is, where a list is narrowed to the entries containing the term.

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

- Updated dependencies [[`8834379`](https://github.com/zoobzio/foundation/commit/8834379594010041bc4bb272c4a87add3ba97265)]:
  - @zoobzio/kit@0.0.5

## 0.0.4

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.4

## 0.0.3

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.3

## 0.0.2

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.2

## 0.0.1

### Patch Changes

- [`00314f2`](https://github.com/zoobzio/foundation/commit/00314f2819555e2681b5739510aaa7ecb3c4c356) Thanks [@zoobzio](https://github.com/zoobzio)! - Initial alpha release: the headless services (`kit`, `query`, `browser`, `form`, `table`), the Vue components, and the Nuxt layer.

- Updated dependencies [[`00314f2`](https://github.com/zoobzio/foundation/commit/00314f2819555e2681b5739510aaa7ecb3c4c356)]:
  - @zoobzio/kit@0.0.1
