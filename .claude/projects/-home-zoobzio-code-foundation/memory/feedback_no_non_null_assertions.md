---
name: No non-null assertions or type casts
description: Avoid ! non-null assertions and `as` type casts — restructure code to let TS narrow naturally
type: feedback
---

Don't use non-null assertions (`!`) or type casts (`as X`) to fix type errors. Restructure the code so TypeScript can narrow types naturally.

**Why:** The user considers these escape hatches rather than real fixes — they hide potential bugs.

**How to apply:** For array access, use `.at(0)` with a truthiness guard, or extract into a variable with an `if` check. For template type narrowing in Vue, use computed properties that vue-tsc can narrow. For passthrough defaults with required props, provide real default values (e.g. `alias: "warning"`) instead of casting empty strings.
