import { defineNuxtConfig } from "nuxt/config";
import highlights from "./config/highlights";

export default defineNuxtConfig({
  extends: ["@foundation/blocks"],
  imports: {
    dirs: ["types"],
  },
  modules: ["@nuxt/content"],
  content: {
    database: process.env.DATABASE_URL
      ? {
          type: "postgresql",
          url: process.env.DATABASE_URL,
        }
      : undefined,
    build: {
      markdown: {
        highlight: {
          theme: {
            default: highlights,
          },
          langs: [
            "json",
            "js",
            "ts",
            "tsx",
            "vue",
            "css",
            "html",
            "bash",
            "md",
            "mdc",
            "yaml",
            "go",
            "sql",
          ],
        },
      },
    },
  },
});
