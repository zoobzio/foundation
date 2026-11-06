---
"@zoobzio/nuxt": patch
---

The nuxt layer's shell shows the loading indicator at once. The shell passed `threshold` to `NuxtLoadingIndicator`, which is not a prop of the component, so Nuxt dropped it and kept its default throttle of 200ms: the bar only appeared for a page change that outlasted the window, and a fast one, a local request in particular, never showed it. The shell now passes `throttle` as `0`, so the bar runs for every page change and for every call that starts it.
