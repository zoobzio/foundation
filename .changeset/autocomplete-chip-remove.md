---
"@zoobzio/vue": patch
"@zoobzio/nuxt": patch
---

The autocomplete has `chipPrepend` and `chipAppend` slots either side of a chip's label, within the button that removes its entry; each takes the chip's context. The nuxt layer's Autocomplete draws `remove` in `chipAppend`, so every chip trails an x.
