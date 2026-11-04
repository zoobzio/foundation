import { defineConfig } from "@prosary/kit/config";

/**
 * The text of the foundation design system: every label, placeholder and
 * notice a component of `@zoobzio/vue` renders when the consumer gives it
 * none. `prosary build` writes the contract module and a bundle per locale
 * under `.dist/`, which this package exports; the Nuxt layer names it as
 * its `prosary.build`, and an app's own `prosary.config.ts` extends this
 * one, so the app builds these messages into its own contract and
 * translates them with it.
 *
 * The source messages are the JSON files under `src/messages/`, one per
 * component or service, each one's keys nested under its name: `empty` in
 * `table.json` is `table.empty`. The source locale is English; the
 * translations under `.i18n/` are written by `prosary translate`, given a
 * `translate.model` and its API key, and checked in.
 */
export default defineConfig({
  messages: "src/messages",
  translate: { source: "en", cache: ".i18n" },
  outDir: ".dist",
});
