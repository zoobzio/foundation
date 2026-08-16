---
"@zoobzio/foundation": patch
---

Menu: wire the dropdown-menu item's `select` re-emit so item clicks reach the
core menu's `select` emit (previously declared but silently dead), and add a
default trigger — a `label` prop rendered through a common Button
(`pt.triggerButton`) when no trigger content is slotted.
