import { z } from "zod";

export const DataDeckSnapshotSchema = z.object({
  sortField: z.string().default(""),
  query: z.string().default(""),
  keywords: z.string().default(""),
  match: z.enum(["all", "any"]).default("all"),
  selectedFacets: z.array(z.string()).default([]),
});

export type DataDeckSnapshot = z.infer<typeof DataDeckSnapshotSchema>;
