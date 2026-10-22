import type { Field, Option } from "@zoobzio/form";

import { z } from "zod";

export type FakePayload = {
  name: string;
  age: number;
  bio: string;
  role: string;
  teams: string[];
  active: boolean;
  plan: string;
  starts: Date;
  tags: string[];
};

export const fakeRoles: Option[] = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
];

export const fakeTeams: Option[] = [
  { value: "core", label: "Core" },
  { value: "design", label: "Design" },
];

export const fakePlans: Option[] = [
  { value: "free", label: "Free" },
  { value: "pro", label: "Pro" },
];

export const fakeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number().min(18, "Must be 18 or older"),
  bio: z.string(),
  role: z.string(),
  teams: z.array(z.string()),
  active: z.boolean(),
  plan: z.string(),
  starts: z.date(),
  tags: z.array(z.string()),
});

/**
 * One field per variant, in the order the form renders them.
 */
export const fakeFields: Field<FakePayload>[] = [
  {
    type: "text",
    key: "name",
    label: "Name",
    placeholder: "Your name",
    colspan: 6,
  },
  { type: "number", key: "age", label: "Age", min: 0, max: 120, colspan: 6 },
  { type: "textarea", key: "bio", label: "Bio", rows: 3 },
  { type: "select", key: "role", label: "Role", options: fakeRoles },
  { type: "multi-select", key: "teams", label: "Teams", options: fakeTeams },
  { type: "checkbox", key: "active", label: "Active" },
  { type: "radio", key: "plan", label: "Plan", options: fakePlans },
  { type: "date", key: "starts", label: "Starts" },
  { type: "tags-input", key: "tags", label: "Tags" },
];

/**
 * A complete, valid payload, so a submit over the defaults succeeds.
 */
export const fakeDefaults: Partial<FakePayload> = {
  name: "Alice",
  age: 30,
  bio: "",
  role: "admin",
  teams: ["core"],
  active: false,
  plan: "free",
  starts: new Date(Date.UTC(2025, 0, 15)),
  tags: ["one"],
};

/**
 * A second valid record, for restores.
 */
export const fakeRecord: FakePayload = {
  name: "Carol",
  age: 41,
  bio: "Hi",
  role: "member",
  teams: ["design"],
  active: true,
  plan: "pro",
  starts: new Date(Date.UTC(2026, 5, 1)),
  tags: [],
};

/**
 * The fake field for a payload key.
 */
export const fakeField = (key: keyof FakePayload): Field<FakePayload> => {
  const field = fakeFields.find((f) => f.key === key);
  if (!field) throw new Error(`no fake field ${key}`);
  return field;
};
