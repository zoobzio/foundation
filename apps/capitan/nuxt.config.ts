import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-12-04",
  extends: ["@foundation/docula"],
  app: {
    head: {
      title: "Capitan",
      meta: [
        {
          name: "description",
          content: "Container orchestration for Go",
        },
      ],
    },
  },
});
