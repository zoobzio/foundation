import type { Component } from "#foundation/types/component";
import type { RoleAria } from "#build/types/a11y";

/**
 * The design-system component → ARIA role mapping.
 *
 * Each component plays exactly one role, so a component only ever tracks a
 * single `Component` generic: the `aria` surface is resolved from this map (see
 * `ComponentRole` / `AriaProps`) rather than the author restating the role.
 * Most entries are the implicit role of the underlying element; the semantic
 * components that have no 1:1 HTML element (`card`, `chip`, `container`, `icon`)
 * are a design choice. Declared `as const satisfies Record<Component, keyof
 * RoleAria>` so the literal roles drive the type while completeness and validity
 * are enforced against the generated role registry — no dependency on the aria
 * derivation layer that consumes this map.
 */
export default {
  alert: "alert",
  anchor: "link",
  article: "article",
  aside: "complementary",
  banner: "banner",
  blockquote: "blockquote",
  button: "button",
  caption: "caption",
  card: "group",
  chip: "button",
  code: "code",
  container: "generic",
  del: "deletion",
  em: "emphasis",
  fieldset: "group",
  footer: "contentinfo",
  group: "group",
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
  h5: "heading",
  h6: "heading",
  header: "banner",
  hr: "separator",
  icon: "img",
  img: "img",
  input: "textbox",
  kbd: "generic",
  label: "generic",
  li: "listitem",
  main: "main",
  nav: "navigation",
  ol: "list",
  p: "paragraph",
  pre: "generic",
  section: "region",
  span: "generic",
  strong: "strong",
  table: "table",
  tbody: "rowgroup",
  td: "cell",
  textarea: "textbox",
  th: "columnheader",
  thead: "rowgroup",
  tr: "row",
  ul: "list",
} as const satisfies Record<Component, keyof RoleAria>;
