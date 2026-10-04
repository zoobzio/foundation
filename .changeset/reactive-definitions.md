---
"@zoobzio/foundation": patch
---

Composite definers (`defineSelect`, `defineDirectory`, …) accept a getter or ref as well as a plain object. A plain definition is still returned untouched; a getter or ref returns a `ComputedRef` of the definition, so a reactive instance is `defineSelect(() => ({ … }))` rather than a hand-rolled `computed`. The computed binds with `v-bind` from `<script setup>` and is valid adapter `settings` as is. New `DefinitionSource` type in `types/definition`.
