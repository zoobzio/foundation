---
"@zoobzio/foundation": patch
---

Fix the table widget forwarding its `header` slot to the head unconditionally, which blanked the head's default sortable-header buttons whenever a consumer used the widget without supplying a `header` slot. Slot forwards now relay only consumer-supplied slots.
