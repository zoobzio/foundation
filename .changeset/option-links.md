---
"@zoobzio/foundation": patch
---

Menu, Tabs, and SegmentedControl items accept an optional `link` (the new shared `LinkTarget` type, also adopted by Tree, Directory, and Breadcrumb). A linked item renders as a real hyperlink through NuxtLink — the reka part renders `as-child` onto the anchor, keeping its role, class, and emits — so navigation no longer needs a slot override. Tabs switch to manual activation whenever any tab is linked, keeping the active tab in step with navigation.
