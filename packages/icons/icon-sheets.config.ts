import { defineConfig } from "@icon-sheets/kit";

/**
 * The foundation icon contract. Each alias names a role a component of
 * `@zoobzio/vue` leaves to an `*Icon` slot, and the Nuxt layer's wrappers
 * fill those slots from these aliases by default. The refs are the plain
 * lucide glyphs; a consumer rebinds an alias by declaring it again in its
 * own contract, which the layer merges over this one.
 */
export default defineConfig({
  id: "foundation",
  name: "Foundation",
  icons: {
    actions: "lucide:ellipsis",
    add: "lucide:plus",
    calendar: "lucide:calendar",
    check: "lucide:check",
    close: "lucide:x",
    columns: "lucide:columns-3",
    drag: "lucide:grip-vertical",
    expand: "lucide:chevron-down",
    first: "lucide:chevrons-left",
    folder: "lucide:folder",
    last: "lucide:chevrons-right",
    next: "lucide:chevron-right",
    prev: "lucide:chevron-left",
    refresh: "lucide:refresh-cw",
    search: "lucide:search",
    "sort-asc": "lucide:arrow-up",
    "sort-desc": "lucide:arrow-down",
    top: "lucide:arrow-up",
  },
  outDir: ".output",
});
