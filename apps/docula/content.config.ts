import { defineCollection, defineContentConfig, z } from "@nuxt/content";

const articleSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  author: z.string().optional(),
  published: z.date().optional(),
  updated: z.date().optional(),
  tags: z.array(z.string()).optional(),
});

export default defineContentConfig({
  collections: {
    example: defineCollection({
      type: "page",
      source: "*.md",
      schema: articleSchema,
    }),
  },
});
