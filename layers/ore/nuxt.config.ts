import { defineNuxtConfig } from "nuxt/config";
import { defineIconSet, mergeIconSets } from "@zoobz-io/iconic";

import icIcons from "@iconify-json/ic/icons.json";
import siIcons from "@iconify-json/simple-icons/icons.json";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",
  imports: {
    dirs: ["types"],
  },
  modules: ["@zoobz-io/iconic/module"],
  iconic: mergeIconSets(
    defineIconSet(icIcons, {
      // Theme
      light: "twotone-light-mode",
      dark: "twotone-dark-mode",
      theme: "twotone-palette",

      // Translate
      translate: "twotone-translate",

      // Navigation
      home: "twotone-home",
      menu: "twotone-menu",
      close: "twotone-close",
      search: "twotone-search",
      filter: "twotone-filter-list",
      sort: "twotone-sort",
      explore: "twotone-explore",
      anchor: "twotone-anchor",
      "folder-open": "twotone-folder-open",

      // Actions
      drag: "twotone-drag-indicator",
      actions: "twotone-more-vert",
      sparkle: "twotone-auto-awesome",
      add: "twotone-add",
      plus: "twotone-add",
      edit: "twotone-edit",
      delete: "twotone-delete",
      save: "twotone-save",
      copy: "twotone-content-copy",

      // Arrows
      "arrow-up": "twotone-arrow-upward",
      "arrow-down": "twotone-arrow-downward",
      "arrow-left": "twotone-arrow-back",
      "arrow-right": "twotone-arrow-forward",

      // Content
      link: "twotone-link",
      "link-copied": "twotone-check",
      toc: "twotone-format-list-bulleted",
      dot: "twotone-fiber-manual-record",

      // Chevrons
      "chevron-up": "twotone-keyboard-arrow-up",
      "chevron-down": "twotone-keyboard-arrow-down",
      "chevron-left": "twotone-keyboard-arrow-left",
      "chevron-right": "twotone-keyboard-arrow-right",
      "chevron-first": "twotone-keyboard-double-arrow-left",
      "chevron-last": "twotone-keyboard-double-arrow-right",

      // Social
      rss: "twotone-rss-feed",
      share: "twotone-share",

      // External
      community: "twotone-groups",
      "edit-document": "twotone-edit-note",
      "report-issue": "twotone-bug-report",
      external: "twotone-open-in-new",

      // Alerts
      lightbulb: "twotone-lightbulb",
      important: "twotone-campaign",

      // Font
      font: "twotone-text-fields",

      // Charts
      "bar-chart": "twotone-bar-chart",
      "pie-chart": "twotone-pie-chart",
      "doughnut-chart": "twotone-donut-large",
      "polar-chart": "twotone-radar",
      "show-chart": "twotone-show-chart",
      "radar-chart": "twotone-radar",
      "scatter-chart": "twotone-scatter-plot",
      "bubble-chart": "twotone-bubble-chart",
      layers: "twotone-layers",
      schedule: "twotone-schedule",

      // Data
      refresh: "twotone-refresh",
      download: "twotone-download",
      "unfold-less": "twotone-unfold-less",
      "unfold-more": "twotone-unfold-more",

      // UI
      tag: "twotone-sell",
      settings: "twotone-settings",
      user: "twotone-person",
      calendar: "twotone-calendar-today",
      "book-open": "twotone-menu-book",
      learn: "twotone-school",
      guides: "twotone-map",
      integration: "twotone-extension",
      reference: "twotone-library-books",
      cache: "twotone-cached",
      code: "twotone-code",
      lock: "twotone-lock",
      shield: "twotone-shield",
      robot: "twotone-smart-toy",
      rocket: "twotone-rocket",
      star: "twotone-star",
      fork: "twotone-call-split",
      issue: "twotone-adjust",
      celebration: "twotone-celebration",
      launch: "twotone-launch",
      bolt: "twotone-bolt",
      speed: "twotone-speed",
      memory: "twotone-memory",
      check: "twotone-check",
      minus: "twotone-remove",
      info: "twotone-info",
      warning: "twotone-warning",
      error: "twotone-error",
    }),
    defineIconSet(siIcons, {
      // Brands
      github: "github",
      discord: "discord",
      x: "x",
      linkedin: "linkedin",
      youtube: "youtube",
      bluesky: "bluesky",
      reddit: "reddit",
      "hacker-news": "ycombinator",
      npm: "npm",
      docker: "docker",
      go: "go",
    }),
  ),
});
