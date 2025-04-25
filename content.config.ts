import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    CTF: defineCollection({
      type: "page",
      source: "CTF/*.md",
      schema: z.object({
        date: z.string(),
        slug: z.string(),
      }),
    }),
    articles: defineCollection({
      type: "page",
      source: "articles/*.md",
      schema: z.object({
        date: z.string(),
        slug: z.string(),
      }),
    }),
  },
});
