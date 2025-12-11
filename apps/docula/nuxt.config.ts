import { defineNuxtConfig } from "nuxt/config";
import elements from "./elements.config";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-17",
  extends: ["@foundation/prose"],
  modules: ["nuxt-typed-router"],
  app: {
    head: {
      title: "Docula",
      meta: [
        {
          name: "description",
          content: "Documentation site built with Foundation",
        },
      ],
    },
  },
  untheme: {
    elements: {
      "community-root": elements.communityRoot,
      "community-content": elements.communityContent,
      "community-item": elements.communityItem,
    },
  },
});
