import { defineConfig } from "@icon-sheets/kit";

/**
 * The foundation icon contract. Each alias names a role a component of
 * `@zoobzio/vue` leaves to a slot (a `prepend` or `append` beside content,
 * or the slot that replaces a button), and the Nuxt layer's wrappers fill
 * those slots from these aliases by default. The refs are the plain
 * lucide glyphs; a consumer rebinds an alias by declaring it again in its
 * own contract, which the layer merges over this one.
 */
export default defineConfig({
  id: "foundation",
  name: "Foundation",
  icons: {
    actions: "lucide:ellipsis",
    add: "lucide:plus",
    blockquote: "lucide:text-quote",
    bold: "lucide:bold",
    "bullet-list": "lucide:list",
    calendar: "lucide:calendar",
    check: "lucide:check",
    close: "lucide:x",
    code: "lucide:code",
    "code-block": "lucide:square-code",
    columns: "lucide:columns-3",
    drag: "lucide:grip-vertical",
    expand: "lucide:chevron-down",
    filter: "lucide:funnel",
    first: "lucide:chevrons-left",
    folder: "lucide:folder",
    heading: "lucide:heading",
    italic: "lucide:italic",
    keywords: "lucide:tags",
    last: "lucide:chevrons-right",
    magic: "lucide:wand-sparkles",
    next: "lucide:chevron-right",
    "ordered-list": "lucide:list-ordered",
    prev: "lucide:chevron-left",
    redo: "lucide:redo-2",
    refresh: "lucide:refresh-cw",
    remove: "lucide:x",
    rule: "lucide:minus",
    search: "lucide:search",
    "sort-asc": "lucide:arrow-up",
    "sort-desc": "lucide:arrow-down",
    strike: "lucide:strikethrough",
    top: "lucide:arrow-up",
    underline: "lucide:underline",
    undo: "lucide:undo-2",
  },
  outDir: ".output",
});
