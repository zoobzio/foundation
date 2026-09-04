---
"@zoobzio/foundation": patch
---

Update the untheme packages to 0.3.0 and ship a base reset stylesheet with
the layer. The untheme bump brings the static cascade to disk: the Nuxt
module now writes `#build/untheme.css` — base token bindings under `:root`,
each modifier context as a `[data-<modifier>="<context>"]` block, wrapped in
`@layer untheme` — and links it into the app's global CSS, so token custom
properties resolve before hydration and are indexable by editors and
tooling. The new `app/assets/css/reset.css` is a Preflight-style reset
added to the layer's `css` array, so every consuming app inherits it
automatically: universal border-box sizing with zeroed margins and padding,
unstyled headings and lists, form controls inheriting typography, and
block-level media. The whole file sits in `@layer reset`, so unlayered
styles — foundation's semantic classes and app CSS alike — win every
equal-specificity conflict against it.
