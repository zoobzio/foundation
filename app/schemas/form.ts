import { z } from "zod";

export const FormSnapshot = z.object({
  values: z.record(z.unknown()).default({}),
  touched: z.array(z.string()).default([]),
});

export type FormSnapshot = z.infer<typeof FormSnapshot>;
