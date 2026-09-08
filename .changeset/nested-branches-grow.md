---
"@zoobzio/foundation": minor
---

Add `core/tree`: a stateless nav tree over reka-ui `TreeRoot`/`TreeItem` (keyboard navigation and aria-tree semantics included). Nodes carry directory's link duality; `v-model` and `v-model:expanded` control selection and expansion; `select`/`toggle` re-emits support lazy-loading branches by declaring `children: []` and swapping `items` on toggle.
