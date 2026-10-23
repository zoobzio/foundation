---
"@zoobzio/nuxt": patch
---

`#components` serves the layer's own wrappers for the components that hold links.

- `Breadcrumb`, `Browser`, `Directory`, `Hero`, `Menu`, `SegmentedControl`, `Table`, `Tabs`, and `Tree` in `app/components/` wrap the vue component and lay `NuxtLink` under its `link` part, so navigation goes through the router with no setup. A wrapper keeps the vue component's contract: the same props, emits, slots, and `ctx`, typed from the same `@zoobzio/vue` types.
- A consumer's `pt.link` composes with the layer's through `usePassthrough`, so an override keeps `NuxtLink` unless it sets `as`. A disabled item has no `href`, and `NuxtLink` renders it as an inert anchor. `Table` and `Browser` lay the part under `pt.body`, `pt.files`, and `pt.breadcrumb.pt`.
- The imports module registers a wrapped name from the layer instead of `@zoobzio/vue`; the vue component itself is no longer in `#components`.
