import { z } from "zod";
import { DECK_DEFAULT_MATCH_MODE } from "#foundation/constants/data/deck";

export const DataDeckSnapshotSchema = z.object({
  sortField: z.string().default(""),
  query: z.string().default(""),
  keywords: z.string().default(""),
  match: z.enum(["all", "any"]).default(DECK_DEFAULT_MATCH_MODE),
  selectedFacets: z.array(z.string()).default([]),
});

export type DataDeckSnapshot = z.infer<typeof DataDeckSnapshotSchema>;
