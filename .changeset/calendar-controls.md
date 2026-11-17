---
"@zoobzio/vue": patch
"@zoobzio/nuxt": patch
"@zoobzio/prose": patch
---

The calendar's search stands over the calendar, with a refresh. The Vue calendar renders its controls, the search and a `refresh` Fab that fetches the range again, in a row of their own under `f-data-calendar-controls`, as the table and the browser do; the toolbar and the view sit in `f-data-calendar-body`. Breaking: the search is no longer inside the toolbar, and the root's frame belongs on the body. The `refresh` part and the `controls` and `refresh` slots are new, the Nuxt layer draws the `refresh` icon under `calendar.refresh`.
