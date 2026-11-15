import type { Config, Seed, View } from "../src/types";

import { z } from "zod";

export const schema = z.object({
  sort: z.string().nullable().default(null),
  size: z.number().default(10),
  hidden: z.array(z.string()).default([]),
});

export type Payload = z.output<typeof schema>;

export const all: Seed<Payload> = {
  id: "all",
  name: "All",
  payload: { sort: null, size: 10, hidden: [] },
};

export const recent: Seed<Payload> = {
  id: "recent",
  name: "Recent",
  payload: { sort: "created", size: 25, hidden: ["notes"] },
};

export const mine: View<Payload> = {
  id: "mine",
  name: "Mine",
  origin: "user",
  payload: { sort: "name", size: 50, hidden: [] },
};

export const fakeConfig: Config<Payload> = {
  schema,
  views: [all, recent],
};
