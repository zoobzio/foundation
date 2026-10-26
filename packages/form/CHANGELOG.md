# @zoobzio/form

## 0.0.6

### Patch Changes

- Updated dependencies []:
  - @zoobzio/kit@0.0.6

## 0.0.5

### Patch Changes

- [`a684eb7`](https://github.com/zoobzio/foundation/commit/a684eb7a6a7c1cc75c5266d86dac7b0a53c9f069) Thanks [@zoobzio](https://github.com/zoobzio)! - Add `tel` and `url` to the text field types, and a `TemporalField` for native string date and time inputs: `time`, `datetime-local`, and `date-input`, which renders `<input type="date">` with a `YYYY-MM-DD` string value. The `date` type stays the `Date`-valued picker. The form field now forwards `maxLength` on text and textarea fields, `minDate` and `maxDate` on date fields, and `required` on checkbox, multi-select, date, and tags-input fields. The date picker gains `required`, `minValue`, and `maxValue` props, and the multi-select and tags input gain `required`.

- [`0c850a2`](https://github.com/zoobzio/foundation/commit/0c850a2c743a548ea9f42e42984c3580ecb289dd) Thanks [@zoobzio](https://github.com/zoobzio)! - Move to Zod 4 (`^4.6.5`). `Config.schema` is now typed against Zod 4's `ZodType`, so consumers must supply Zod 4 schemas; Zod 3's `UnknownKeysParam`-based `ZodObject` signature no longer applies. The service now shallow-freezes its `config`, so a reactive wrapper of the service (Vue's `reactive`) never proxies the schema: Zod 4 defines a non-configurable `_zod` on every schema, and a proxied schema trips the Proxy `get` invariant on the first parse.

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
