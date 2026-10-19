---
"@zoobzio/deck": minor
"@zoobzio/foundation": minor
---

Extract the data deck service into the headless `@zoobzio/deck` package. The
service, its state container factory, domain types, and domain constants now
live there with no framework dependency. The service reads and writes a plain
state container through optional get/set middleware and emits `change`,
`updated`, `polled`, and `failed` through its own `on` listeners. A poll
failure is now reported (`failed`, relayed as the `deck:failed` hook and the
widget's `failed` emit) instead of swallowed. The layer keeps the Nuxt wiring
in `stores/deck` (one `useState` container per deck id) and `factories/deck`
(events relayed onto the hook bus and logger). `@zoobzio/foundation/services/deck`
is removed — import `DeckService` from `@zoobzio/deck`. Type and constant
import paths on the layer are unchanged. The deck widget no longer inits the
service on mount — the caller drives `init()`, as the table widget does.
