import type { Config, Field } from "../src/types";

import { z } from "zod";

export type Payload = {
  name: string;
  email: string;
  amount: number;
  active: boolean;
};

export const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  amount: z.number().min(0, "Amount must be positive"),
  active: z.boolean(),
});

export const fields: Field<Payload>[] = [
  { type: "text", key: "name", label: "Name" },
  { type: "email", key: "email", label: "Email" },
  { type: "number", key: "amount", label: "Amount" },
  { type: "checkbox", key: "active", label: "Active" },
];

export const defaults: Partial<Payload> = { name: "Alice", active: true };

export const fakeConfig: Config<Payload> = {
  title: "Contact",
  fields,
  schema,
  defaults,
};

export const validPayload: Payload = {
  name: "Bob",
  email: "bob@example.com",
  amount: 10,
  active: false,
};
