import { defineNuxtConfig } from "nuxt/config";
import { defineUntheme } from "@foundation/untheme/config";
import highlights from "./config/highlights";

export default defineNuxtConfig({
  extends: ["@foundation/base-layer"],
  modules: ["@nuxt/content"],
  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            default: highlights,
          },
        },
      },
    },
  },
  untheme: defineUntheme({
    roles: {
      header: {
        width: "ref-full",
        "max-width": "ref-width-container",
        "margin-left": "ref-auto",
        "margin-right": "ref-auto",
        "padding-left": "ref-spacing-lg",
        "padding-right": "ref-spacing-lg",
      },
      section: {
        width: "ref-full",
        "max-width": "ref-width-container",
        "margin-left": "ref-auto",
        "margin-right": "ref-auto",
        "padding-left": "ref-spacing-lg",
        "padding-right": "ref-spacing-lg",
        display: "ref-display-grid",
        "grid-template-columns": "ref-layout-trifold",
      },
    },
  }),
});
