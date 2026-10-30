# @zoobzio/theme

The foundation design system's theme: the
[aurora](https://github.com/zoobzio/untheme/tree/main/presets/aurora) preset of
[untheme](https://github.com/zoobzio/untheme) with the foundation palette as
its base and the color roles the Nuxt layer's shell reads, built by
[`@untheme/kit`](https://github.com/zoobzio/untheme/tree/main/packages/kit)
into the modules, the layers, and the preset manifest the untheme runtime
consumes. The package is itself a preset: `@zoobzio/nuxt` names it as its
default `untheme` option, and a downstream theme names it as its source.

## Layout

```
untheme.config.ts      the kit config: aurora as the source, the palette and the roles on top
scripts/generate.mjs   the seeds of the palette, and the script that writes src/foundation.json
src/foundation.json    the palette: its name, its description, and the eight ramps
src/roles.json         the shell roles: one color role per thing the layer's shell draws, over aurora's roles
.output/               the kit's output (generated, not committed)
```

The config names aurora as a preset and extends it twice. `src/foundation.json`
joins the `ramps` set after aurora's own palette, so its stops win. Every role
of aurora references a ramp stop, and every modifier context rebinds a role, so
the roles, the dark scheme, contrast, vibrancy, and every theme follow the
foundation ramps with no bindings of this package's own. `src/roles.json` joins
the `roles` set: each token there is a color role over a role of aurora, so it
follows the scheme and the applied theme the same way. Aurora's thirty-one
themes come along as layers, and the foundation palette is the first layer of
the build, the one a visitor comes back to.

| Ramp              | Color                                  | Seed      |
| ----------------- | -------------------------------------- | --------- |
| `primary`         | cobalt                                 | `#2f6fed` |
| `secondary`       | amber                                  | `#e08a1e` |
| `tertiary`        | teal                                   | `#1b9e8a` |
| `neutral`         | stone grey                             | `#77787a` |
| `neutral-variant` | the same, a shade cooler, for outlines | `#747a86` |

The `error`, `success`, and `warning` seeds are aurora's. Everything else is
aurora's, untouched: the color roles and their contrast and vibrancy channels,
the type scale, shape, space, elevation, motion, state, blur, stroke, border,
and gradient tokens, and every modifier axis.

## The shell roles

The components of `@zoobzio/vue` read no tokens: they are unstyled, and a
consumer's stylesheet binds them. The Nuxt layer's shell is the one place
foundation itself draws something with a color, so this package names those
roles rather than leaving the shell to reach into aurora's vocabulary:

| Token               | Binds       | Read by                                         |
| ------------------- | ----------- | ----------------------------------------------- |
| `loading-indicator` | `{primary}` | `NuxtLoadingIndicator` in the layer's `app.vue` |

A role is a reference to a role of aurora, never a literal, so it follows the
color scheme, the vibrancy and contrast channels, and the applied theme with
no bindings of its own. A new role of the shell is one more entry in
`src/roles.json`; it lands on the contract, the `Token` union, and the
cascade with the next build. A downstream theme rebinds a role by declaring
it again in a set or a context of its own (see
[Extending](#extending-the-theme)).

## Changing a color

The ramps are generated, not hand-written. `scripts/generate.mjs` holds one
seed for each ramp and writes `src/foundation.json` with `palette` from
`@untheme/aurora/ramp`, aurora's own generator. The seed gives hue and chroma,
and every ramp shares aurora's lightness ladder, so every stop sits where
aurora's does. To change a color, edit the seed and run:

```sh
pnpm generate && pnpm format
```

## Exports

- `@zoobzio/theme/config`: the built `{ theme, input }`: the base theme and
  the boot selection. Its declaration exports the `Contract` type.
- `@zoobzio/theme/manifest`: each modifier and its contexts with an id, a
  name, and a description, for a settings panel.
- `@zoobzio/theme/layers` and `@zoobzio/theme/layers/<id>.json`: the layer
  list (`foundation` first, then every aurora theme) and each layer, ready for
  `apply`.
- `@zoobzio/theme/preset.json` and `@zoobzio/theme/resolver.json`: the preset
  manifest and the portable resolver document of the build. Another kit
  config builds on them with `source: "npm:/@zoobzio/theme"`.
- `@zoobzio/theme/src/*`: the palette and the roles, as DTCG JSON, which the
  resolver references.
- `@zoobzio/theme`: the `tokens` and `modifiers` lists, the `isToken` and
  `isModifier` guards, and the `Token`, `Modifier`, `Context`, and `Mod`
  types.

## Extending the theme

`@zoobzio/nuxt` loads `@untheme/nuxt` with this package as its default
`untheme` option, so an app that extends the layer boots the foundation
palette and reads `var(--loading-indicator)` and every aurora token with no
setup. An app with a theme of its own names this package as the source of its
kit config instead of aurora, so the shell roles come along and the app's
palette takes the base:

```ts
// packages/theme/untheme.config.ts
import { defineConfig } from "@untheme/kit";

export default defineConfig({
  source: "npm:/@zoobzio/theme",
  id: "acme",
  name: "Acme",
  extend: {
    sets: {
      ramps: { sources: [{ $ref: "./src/acme.json" }] },
    },
  },
  outDir: ".output",
});
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  extends: ["@zoobzio/nuxt"],
  untheme: { preset: "@acme/theme" },
});
```

The untheme module takes the closest layer's `untheme` option as a whole, so
the app's preset replaces the foundation's. The app's palette joins the
`ramps` set after this package's, and its layer list is its own palette
first, then `foundation`, then every aurora theme. The app rebinds a shell
role by declaring the token again in a set of its own, or in a context under
`extend.modifiers`, and adds roles of its own the same way this package does.

The untheme module resolves a preset from the app's root, so an app that
relies on the layer's default lists `@zoobzio/theme` and `untheme` in its own
dependencies.

## Scripts

- `pnpm build`: writes `.output/`. It also runs on install via `prepare`.
- `pnpm generate`: writes `src/foundation.json` from the seeds.
- `pnpm test`: rebuilds, then checks the modules and the layers against the
  palette, the roles, and aurora's own build, and that the package is a source
  for another build.
