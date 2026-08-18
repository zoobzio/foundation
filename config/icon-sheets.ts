import { defineNuxtIconSheetsConfig } from "@icon-sheets/nuxt/config";

// Refs resolve at build time against the local @iconify-json/{lucide,mdi}
// collections (public Iconify API is the fallback). Aliases are the semantic
// names the layer's components and constants reference.
export default defineNuxtIconSheetsConfig({
  id: "foundation",
  name: "Foundation Icons",
  icons: {
    actions: "lucide:ellipsis-vertical",
    add: "lucide:plus",
    "arrow-right": "lucide:arrow-right",
    "arrow-up": "lucide:arrow-up",
    calendar: "lucide:calendar",
    "chevron-down": "lucide:chevron-down",
    "chevron-first": "lucide:chevron-first",
    "chevron-last": "lucide:chevron-last",
    "chevron-left": "lucide:chevron-left",
    "chevron-right": "lucide:chevron-right",
    "chevron-up": "lucide:chevron-up",
    check: "lucide:check",
    close: "lucide:x",
    copy: "lucide:copy",
    delete: "lucide:trash-2",
    download: "lucide:download",
    drag: "lucide:grip-vertical",
    edit: "lucide:pencil",
    external: "lucide:external-link",
    filter: "lucide:funnel",
    home: "lucide:house",
    layers: "lucide:layers",
    minus: "lucide:minus",
    refresh: "lucide:refresh-cw",
    schedule: "lucide:clock",
    search: "lucide:search",
    settings: "lucide:settings",
    tag: "lucide:tag",
    user: "lucide:user",

    // Chart renderer toolbar icons — mdi fills the shapes lucide lacks.
    "bar-chart": "lucide:chart-column",
    "bubble-chart": "mdi:chart-bubble",
    "doughnut-chart": "mdi:chart-donut",
    "pie-chart": "lucide:chart-pie",
    "polar-chart": "mdi:chart-arc",
    "radar-chart": "lucide:radar",
    "scatter-chart": "lucide:chart-scatter",
    "show-chart": "lucide:chart-line",
  },
});
