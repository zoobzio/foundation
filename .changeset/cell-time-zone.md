---
"@zoobzio/nuxt": patch
---

The nuxt layer's date and datetime cells format in the service's time zone. The `cell:date` and `cell:datetime` slots of the table and browser wrappers formatted through the app's prosary service with no zone, so a cell read in the runtime's own: a server in UTC and a browser elsewhere rendered different text, and the page hydrated with a mismatch. Each now passes the table's or the browser's `timeZone` — the config's, `UTC` when it names none — as the vue components' own cells do, so the config's zone is the one a cell renders in on both sides. A calendar day, `YYYY-MM-DD`, still formats in UTC.
