---
"@zoobzio/theme": patch
"@zoobzio/nuxt": patch
---

Theme. A new `@zoobzio/theme` package carries the foundation theme: the aurora preset of untheme with the foundation palette (cobalt, amber, and teal on stone greys) as its base, authored as an `@untheme/kit` config over `npm:/@untheme/aurora` and built into the modules, the layers (`foundation` first, then every aurora theme), and the preset manifest the untheme runtime consumes. Beside the palette, `src/roles.json` is the injection point for the tokens foundation itself reads: color roles over aurora's roles, so each follows the scheme, the channels, and the applied theme with no bindings of its own. The first is `loading-indicator`, bound to `{primary}`.

The Nuxt layer loads `@untheme/nuxt` with that package as its default `untheme` option, the way it loads `@icon-sheets/nuxt` with `@zoobzio/icons`, so an app that extends the layer boots the foundation palette, gets `useUntheme()` and the aurora cascade on every page, and may swap a scheme or apply a theme with no setup. An app with a theme of its own names `@zoobzio/theme` as the source of its kit config in place of aurora and passes its own package as `untheme.preset`; the module takes the closest layer's option as a whole. The shell's `NuxtLoadingIndicator` reads `var(--loading-indicator)` in place of `var(--primary)`.
