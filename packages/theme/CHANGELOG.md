# @zoobzio/theme

## 0.0.15

### Patch Changes

- [`59e70a6`](https://github.com/zoobzio/foundation/commit/59e70a6626c0b612283282729e4ff7ee91822ea7) Thanks [@zoobzio](https://github.com/zoobzio)! - Bump version for theme publish.

## 0.0.14

### Patch Changes

- [`08825c2`](https://github.com/zoobzio/foundation/commit/08825c2c7be451cd1177a153a8d33198396c9aa4) Thanks [@zoobzio](https://github.com/zoobzio)! - Theme. A new `@zoobzio/theme` package carries the foundation theme: the aurora preset of untheme with the foundation palette (cobalt, amber, and teal on stone greys) as its base, authored as an `@untheme/kit` config over `npm:/@untheme/aurora` and built into the modules, the layers (`foundation` first, then every aurora theme), and the preset manifest the untheme runtime consumes. Beside the palette, `src/roles.json` is the injection point for the tokens foundation itself reads: color roles over aurora's roles, so each follows the scheme, the channels, and the applied theme with no bindings of its own. The first is `loading-indicator`, bound to `{primary}`.

  The Nuxt layer loads `@untheme/nuxt` with that package as its default `untheme` option, the way it loads `@icon-sheets/nuxt` with `@zoobzio/icons`, so an app that extends the layer boots the foundation palette, gets `useUntheme()` and the aurora cascade on every page, and may swap a scheme or apply a theme with no setup. An app with a theme of its own names `@zoobzio/theme` as the source of its kit config in place of aurora and passes its own package as `untheme.preset`; the module takes the closest layer's option as a whole. The shell's `NuxtLoadingIndicator` reads `var(--loading-indicator)` in place of `var(--primary)`.
