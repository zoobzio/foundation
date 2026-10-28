---
"@zoobzio/form": patch
"@zoobzio/vue": patch
---

Add an optional `hint` to every form field config: help text the form field renders beneath the control, as a `hint` slot with the field context. The form field now wires its parts together with ids derived from the form id and the field key, served as `ctx.ids`: the label's `for` targets the control, a grouped control (radio, date picker, rich text) names the label through `aria-labelledby`, and the control lists the hint and the error in `aria-describedby` while each renders. To carry that wiring, the focusable part of the reka-backed controls (the checkbox root, the radio group root, the select and multi-select trigger, the date picker field, the tags input input) now also types against HTML attributes in `pt`.
