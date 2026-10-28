---
"@zoobzio/vue": patch
---

The table, form, and browser no longer wrap their contents in a scroller. Whether and how a data view scrolls is a layout decision that belongs to the consumer, so the `scroller` passthrough key is gone from `TablePassthrough`, `FormPassthrough`, and `BrowserPassthrough`. Wrap the component in a `Scroller` (or any scrolling container) where scrolling is wanted. The command palette and autocomplete keep their internal scrollers: their lists live inside a bounded popover.
