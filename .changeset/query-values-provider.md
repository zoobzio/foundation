---
"@zoobzio/query": patch
---

A field's `values` may be a provider, `(term) => string[]`, beside a list: the value stage gives it the term, so the suggestions can be built from what is typed. A provider's result stands as is, where a list is narrowed to the entries containing the term.
