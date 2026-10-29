---
"@zoobzio/query": patch
"@zoobzio/nuxt": patch
---

`Field` and `Option` of the query are interfaces, so a layer may widen them by declaration merging, and a field's properties beyond the ones the query reads are carried onto its option in the panel and the trail. The nuxt layer widens both with `icon: IconAlias`, so a field given an `icon` draws it before its option in the autocomplete, and draws the branch arrows: `next` after a field or operator option, as selecting it enters a stage, `expand` after the active trail option, as its stage is the one open, and none after a value, as it commits. `@zoobzio/query` is a dependency of the layer.
