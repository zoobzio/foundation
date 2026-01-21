import path from "node:path";
import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    sentinel: defineCollection({
      type: "page",
      source: {
        cwd: path.resolve("/home/zoobzio/code/sentinel/docs"),
        include: "**/*.md",
      },
      schema: z.object({
        author: z.string().optional(),
        published: z.date().optional(),
        updated: z.date().optional(),
        readtime: z.string().optional(),
      }),
    }),
  },
});
