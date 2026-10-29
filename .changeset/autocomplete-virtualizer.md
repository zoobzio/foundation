---
"@zoobzio/vue": patch
---

The autocomplete virtualizes its active panel: the options render through reka's `AutocompleteViewport` and `AutocompleteVirtualizer`, so only the rows in view, plus an overscan, are in the DOM however long the list. The `scroller` passthrough key is gone from `AutocompletePassthrough`; `viewport` and `virtualizer` take its place, the latter taking `overscan` and `estimateSize`. A row's height is measured from the DOM once rendered, so the estimate only seeds the first layout. The viewport scrolls natively and the reka viewport hides its scrollbar; a bounded height on `.f-autocomplete-viewport` is what makes it scroll. An `item` slot on the active panel must render exactly one root element and receives `measure`, a function ref to put on that element. Trail panels still render plain buttons and are not virtualized.
