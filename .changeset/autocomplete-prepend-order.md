---
"@zoobzio/vue": patch
---

The autocomplete's `inputPrepend` slot leads the root, before the chips, so the field reads prepend, chips, input, append. It was within the input's group, after the chips.
