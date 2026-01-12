import path from "path";
import { defineCollection, defineContentConfig } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    sentinel: defineCollection({
      type: "page",
      source: {
        cwd: path.resolve("/home/zoobzio/code/sentinel/docs"),
        include: "**/*.md",
      },
    }),
  },
});
