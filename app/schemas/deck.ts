import { z } from "zod";
import { DECK_DEFAULT_MATCH_MODE } from "#foundation/constants/deck";

export const DeckSnapshot = z.object({
  sortField: z.string().default(""),
  query: z.string().default(""),
  keywords: z.string().default(""),
  match: z.enum(["all", "any"]).default(DECK_DEFAULT_MATCH_MODE),
  selectedFacets: z.array(z.string()).default([]),
});

export type DeckSnapshot = z.infer<typeof DeckSnapshot>;
