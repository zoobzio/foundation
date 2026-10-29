---
"@zoobzio/form": patch
"@zoobzio/vue": patch
---

The form no longer carries a title. `title` is gone from the form's `Config`, and the form component no longer renders a toolbar: the `toolbar` slot and its default markup (`.f-data-form-toolbar` with the title in `.f-data-form-title`) are gone from the form and from `FormSlots`. A consumer that wants a heading renders it outside the form.
