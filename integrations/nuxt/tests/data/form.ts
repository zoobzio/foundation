import type { Field } from "@zoobzio/form";

import { z } from "zod";

export type FakePayload = {
  name: string;
  amount: number;
};

export const fakeSchema = z.object({
  name: z.string().min(1),
  amount: z.number(),
});

export const fakeFields: Field<FakePayload>[] = [
  { type: "text", key: "name", label: "Name" },
  { type: "number", key: "amount", label: "Amount" },
];

export const fakeDefaults: Partial<FakePayload> = { name: "Alice" };
