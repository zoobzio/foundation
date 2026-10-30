---
"@zoobzio/vue": patch
---

The autocomplete's scroller wraps the first panel only, the one open before any selection. Once a group has an option set, the active panel renders in a plain `.f-autocomplete-viewport` element with no scroller, and `pt.viewport` does not apply to it. The virtualizer still windows that panel's options, scrolling within the element once a height bounds it.
