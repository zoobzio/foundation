---
"@zoobzio/query": minor
"@zoobzio/table": patch
"@zoobzio/nuxt": patch
---

Free text is quoted in the query's draft: `"text"` is the text stage beside `Label: op term`, so a word that is also a field's label is never taken for a search. The field panel leads with the text option, labelled `Search` or the config's `textLabel`, while nothing is typed; selecting it opens the quote before the term typed so far, and while the draft is quoted it is the active trail option, so selecting it again steps back out. The closing quote commits the text at once, as Enter does an unclosed one. A bare term submits nothing: it names a field still. `textFor` of a text entry is its quoted text, the same string `labelFor` gives and `unwrap` hands back minus the closing quote. With `text: false` there is no text option and a quote is a character. The table's config takes `textLabel` and hands it to its query. The nuxt layer's autocomplete draws the `search` icon before the text option, and `next` after it as after any option that enters a stage.
