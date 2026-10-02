---
"@zoobzio/foundation": patch
---

Make option-based components generic over their item type. Accordion, Facets, Listbox, Menu, Radio, SegmentedControl, Select, and Tabs now infer `T` from their items, so slot props, passthrough iterators, and context carry the caller's own option type instead of the base `Option`/`FacetItem`.
