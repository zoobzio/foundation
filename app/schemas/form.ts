import { z } from "zod";

export const DataFormSnapshotSchema = z.object({
  values: z.record(z.unknown()).default({}),
  touched: z.array(z.string()).default([]),
});

export type DataFormSnapshot = z.infer<typeof DataFormSnapshotSchema>;
