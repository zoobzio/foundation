# @zoobzio/prose

The text of the foundation design system: every label, placeholder and
notice a component of [`@zoobzio/vue`](../../integrations/vue/) renders
when the consumer gives it none, authored as FormatJS message descriptors
and built by [`@prosary/kit`](https://github.com/zoobzio/prosary) into a
typed contract and a bundle per locale.

```sh
pnpm --filter @zoobzio/prose build
```

- `prosary.config.ts` — the kit config: where the messages are, the source
  locale, and the translation cache. Exported as `@zoobzio/prose/config`,
  so an app's own kit config can `extends` it and build these messages into
  its own contract, translated with the app's.
- `src/messages/` — the source messages, in English, one file per
  component or service: `empty` in `table.json` is the key `table.empty`.
  Each carries a `description` for the translator.
- `.dist/` — the build: the `contract` with its `Key` and `Contract` types,
  the `bundles` loaders, and `messages/<locale>.mjs` per locale. What the
  package exports.
- `.i18n/` — the translations, as `prosary translate` writes them, checked
  in. Empty until a `translate.model` is set in the config and the command
  is run with the model's API key.

## Use

`@zoobzio/vue` knows nothing of this package: its components render their
text as it is, in English by default. The Nuxt layer points the prosary
module at the build — `prosary: { build: "@zoobzio/prose" }` — the way it
points untheme at `@zoobzio/theme`, and lays these messages over the
components through its wrappers, so an app that extends the layer gets the
components' text in its contract, in the visitor's locale, with no setup.

An app with text of its own ships a prose package of the same shape, with a
kit config that extends this one, and points the layer's module at it:

```ts
// @acme/prose/prosary.config.ts
export default defineConfig({
  messages: "src/messages",
  extends: "@zoobzio/prose/config",
  translate: { source: "en", targets: ["fr", "de"], cache: ".i18n" },
});

// nuxt.config.ts
export default defineNuxtConfig({
  extends: ["@zoobzio/nuxt"],
  prosary: { build: "@acme/prose" },
});
```

The app's keys join these; a key the app declares again replaces it; and
the app's `prosary translate` translates the app's own messages. A locale
this package lacks falls back to the source message.
