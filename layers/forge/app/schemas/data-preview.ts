import { z } from "zod";

export const DataPreviewSnapshotSchema = z.object({});

export type DataPreviewSnapshot = z.infer<typeof DataPreviewSnapshotSchema>;
