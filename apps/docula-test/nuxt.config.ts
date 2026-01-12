import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  compatibilityDate: "2025-01-12",
  extends: ["@foundation/docula"],
  app: {
    head: {
      title: "Sentinel Docs",
      meta: [
        {
          name: "description",
          content: "Sentinel documentation - test instance",
        },
      ],
    },
  },
  appConfig: {
    collection: {
      key: "sentinel",
      title: "Sentinel",
      description: "Event-driven Go library documentation",
      repo: "https://github.com/zoobzio/sentinel",
    },
  },
});
