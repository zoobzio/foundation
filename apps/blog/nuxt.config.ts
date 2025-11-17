import { defineNuxtConfig } from "nuxt/config";
import { defineIconic } from "@foundation/iconic";
import icIcons from "@iconify-json/ic/icons.json";

export default defineNuxtConfig({
  extends: ["@foundation/content-layer"],
  iconic: defineIconic(icIcons, {
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

    // Actions
    add: "twotone-add",
    edit: "twotone-edit",
    delete: "twotone-delete",
    save: "twotone-save",

    // Arrows
    "arrow-up": "twotone-arrow-upward",
    "arrow-down": "twotone-arrow-downward",
    "arrow-left": "twotone-arrow-back",
    "arrow-right": "twotone-arrow-forward",

    // Content
    link: "twotone-link",
    "link-copied": "twotone-check",

    // Chevrons
    "chevron-up": "twotone-keyboard-arrow-up",
    "chevron-down": "twotone-keyboard-arrow-down",
    "chevron-left": "twotone-keyboard-arrow-left",
    "chevron-right": "twotone-keyboard-arrow-right",

    // UI
    settings: "twotone-settings",
    user: "twotone-person",
    check: "twotone-check",
    info: "twotone-info",
    warning: "twotone-warning",
    error: "twotone-error",
  }),
});
