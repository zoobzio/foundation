# @zoobzio/query

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
