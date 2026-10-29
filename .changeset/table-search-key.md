---
"@zoobzio/vue": patch
"@zoobzio/icons": patch
"@zoobzio/nuxt": patch
---

The autocomplete has `inputPrepend` and `inputAppend` slots either side of its input and hint, within the group its content anchors to, as the command's filter does. The icon contract adds `magic` (`lucide:wand-sparkles`). In the nuxt layer, the table's search renders through the new `TableSearch`: the layer's Autocomplete with the `magic` icon before its input, the search key drawn as a `kbd` after it, and that key (`TABLE_SEARCH_KEY`, `/`) focusing the input from anywhere on the page the user is not already typing. The key is bound by `useFocusKey`, a composable over `@vueuse/core`'s `useMagicKeys` that focuses a target on a bare press of a key outside a field and cancels the press, leaving a press within a field or with a modifier held to its own handler; `@vueuse/core` is a new dependency of the layer. Both are on `#imports`.
