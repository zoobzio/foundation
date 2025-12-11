import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-12-04",
  extends: ["@foundation/docula"],
  app: {
    head: {
      title: "zoobz.io",
      meta: [
        {
          name: "description",
          content: "Personal blog",
        },
      ],
    },
  },
});
