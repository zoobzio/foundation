import { z } from "zod";

export const DataChartSnapshotSchema = z.object({
  activeVariant: z.string().default(""),
  activeRenderer: z.string().default(""),
  activeField: z.string().nullable().default(null),
  activeX: z.string().nullable().default(null),
  activeY: z.string().nullable().default(null),
  activeBucket: z.enum(["1h", "1d", "1w", "1mo"]).nullable().default(null),
  activeRange: z
    .tuple([z.coerce.date(), z.coerce.date()])
    .nullable()
    .default(null),
});

export type DataChartSnapshot = z.infer<typeof DataChartSnapshotSchema>;
