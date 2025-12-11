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
    blog: defineCollection({
      type: "page",
      source: "blog/*.md",
      schema: articleSchema,
    }),
    pipz: defineCollection({
      type: "page",
      source: {
        repository: "https://github.com/zoobzio/pipz",
        include: "docs/**/*.md",
        token: process.env.GITHUB_TOKEN,
      },
      schema: articleSchema,
    }),
    capitan: defineCollection({
      type: "page",
      source: {
        repository: "https://github.com/zoobzio/capitan",
        include: "docs/**/*.md",
        token: process.env.GITHUB_TOKEN,
      },
      schema: articleSchema,
    }),
  },
});
