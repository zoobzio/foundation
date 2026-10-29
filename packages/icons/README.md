# @zoobzio/icons

The foundation design system's icon contract, as an
[icon-sheets](https://github.com/zoobzio/icon-sheets) config built by
`@icon-sheets/kit` into a resolved contract, a typed alias union, and SVG
sprites.

The components of `@zoobzio/vue` draw no icons of their own: each leaves
its icons to `*Icon` slots (`prevIcon`, `closeIcon`, `itemIcon`, …). This
package names the roles those slots play, and the Nuxt layer fills the
slots from these aliases by default. The vue package never depends on it.

## Layout

```
icon-sheets.config.ts  each alias mapped to its lucide ref
.output/               the kit's output (generated, not committed)
```

Aliases name an icon by role (`prev`, `close`, `sort-asc`), not by glyph,
so a consumer rebinds a role without touching the components that draw it.
The ref behind each one resolves from the locally installed
`@iconify-json/lucide` package.

## Exports

- `@zoobzio/icons`: `type Alias`, `aliases`, `isAlias`, `prefix`, `href`.
- `@zoobzio/icons/config`: the resolved contract.
- `@zoobzio/icons/sets`: the resolved sets, keyed by id (none yet).
- `@zoobzio/icons/sheet`: the hidden sprite markup, for inlining.
- `@zoobzio/icons/sprite.svg`: the standalone sprite file.

## Extending the contract

`@zoobzio/nuxt` hands `config`, `sets` and `prefix` to `@icon-sheets/nuxt`
as its default `iconSheets` option. An app that extends the layer gets
every alias here with no setup, and an app with its own icons package
passes it the same way:

```ts
// nuxt.config.ts
import { prefix } from "@acme/icons";
import config from "@acme/icons/config";
import sets from "@acme/icons/sets";

export default defineNuxtConfig({
  extends: ["@zoobzio/nuxt"],
  iconSheets: { ...config, sets, prefix },
});
```

Nuxt merges a layer's config under the app's, object by object, so the
app's `contract.icons` lands over this package's: the app adds its own
aliases, rebinds a foundation alias by declaring it again, and keeps every
alias it leaves alone. The `Alias` union the app compiles against is the
merged set, so a wrapper's default and an app's own `<Icon name="…" />`
are checked against the same names.

## Scripts

- `pnpm build`: writes `.output/`. It also runs on install via `prepare`.
- `pnpm test`: rebuilds, then checks the output against the config and
  its Iconify sources.
