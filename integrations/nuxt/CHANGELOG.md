# @zoobzio/nuxt

## 0.0.3

### Patch Changes

- [`ad41dec`](https://github.com/zoobzio/foundation/commit/ad41dec4af4ca8a5bf6b9722dcd09c41277a415c) Thanks [@zoobzio](https://github.com/zoobzio)! - The imports module registers `@zoobzio/vue` components, `define*` functions, and types with their `.dist` declarations as the type source (`declarationPath` / `typeFrom`), while runtime still resolves to source. Generated `#components` and `#imports` declarations no longer pull `@zoobzio/vue` source into a consumer's typecheck.

- Updated dependencies []:
  - @zoobzio/browser@0.0.3
  - @zoobzio/form@0.0.3
  - @zoobzio/table@0.0.3
  - @zoobzio/vue@0.0.3

## 0.0.2

### Patch Changes

- [`11569ca`](https://github.com/zoobzio/foundation/commit/11569cac7b307f2b3c95a6c912dbd128d0dc7368) Thanks [@zoobzio](https://github.com/zoobzio)! - The layer's own code no longer reads from `#imports` or `#components`.

  - Both are the consumer's build artifacts: the imports module fills them, and the layer's source imports Nuxt APIs from `#app`, Vue APIs from `vue`, and `NuxtLink` from `#app/components/nuxt-link`. Only `app.vue` keeps `#components`, for the shell built-ins whose module depends on the consumer's pages.
  - An oxlint layer graph (types > constants > utils > stores > composables > factories > components > plugins) refuses an import from a higher layer, a cycle, and the two aliases, so the layer's `#imports` surface cannot be used to route around it.

- [`11569ca`](https://github.com/zoobzio/foundation/commit/11569cac7b307f2b3c95a6c912dbd128d0dc7368) Thanks [@zoobzio](https://github.com/zoobzio)! - `#components` serves the layer's own wrappers for the components that hold links.

  - `Breadcrumb`, `Browser`, `Directory`, `Hero`, `Menu`, `SegmentedControl`, `Table`, `Tabs`, and `Tree` in `app/components/` wrap the vue component and lay `NuxtLink` under its `link` part, so navigation goes through the router with no setup. A wrapper keeps the vue component's contract: the same props, emits, slots, and `ctx`, typed from the same `@zoobzio/vue` types.
  - A consumer's `pt.link` composes with the layer's through `usePassthrough`, so an override keeps `NuxtLink` unless it sets `as`. A disabled item has no `href`, and `NuxtLink` renders it as an inert anchor. `Table` and `Browser` lay the part under `pt.body`, `pt.files`, and `pt.breadcrumb.pt`.
  - The imports module registers a wrapped name from the layer instead of `@zoobzio/vue`; the vue component itself is no longer in `#components`.

- Updated dependencies [[`bfcac44`](https://github.com/zoobzio/foundation/commit/bfcac44da97192a29931450ae82bef3539006684), [`11569ca`](https://github.com/zoobzio/foundation/commit/11569cac7b307f2b3c95a6c912dbd128d0dc7368), [`11569ca`](https://github.com/zoobzio/foundation/commit/11569cac7b307f2b3c95a6c912dbd128d0dc7368)]:
  - @zoobzio/vue@0.0.2
  - @zoobzio/browser@0.0.2
  - @zoobzio/form@0.0.2
  - @zoobzio/table@0.0.2

## 0.0.1

### Patch Changes

- [`00314f2`](https://github.com/zoobzio/foundation/commit/00314f2819555e2681b5739510aaa7ecb3c4c356) Thanks [@zoobzio](https://github.com/zoobzio)! - Initial alpha release: the headless services (`kit`, `query`, `browser`, `form`, `table`), the Vue components, and the Nuxt layer.

- Updated dependencies [[`00314f2`](https://github.com/zoobzio/foundation/commit/00314f2819555e2681b5739510aaa7ecb3c4c356)]:
  - @zoobzio/browser@0.0.1
  - @zoobzio/form@0.0.1
  - @zoobzio/table@0.0.1
  - @zoobzio/vue@0.0.1
