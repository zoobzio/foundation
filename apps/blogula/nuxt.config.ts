import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-17",
  extends: ["@foundation/prose"],
  app: {
    head: {
      title: "Blogula",
      meta: [
        {
          name: "description",
          content: "Blog site built with Foundation",
        },
      ],
    },
  },
});
