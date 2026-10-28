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
  phone: string;
  site: string;
  alarm: string;
  meeting: string;
  birthday: string;
  avatar: File;
  attachments: File[];
  body: string;
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
  phone: z.string(),
  site: z.string(),
  alarm: z.string(),
  meeting: z.string(),
  birthday: z.string().min(1, "Birthday is required"),
  avatar: z.file().mime(["image/png"], "PNG only"),
  attachments: z.array(z.file()).max(2, "Two at most"),
  body: z.string().min(1, "Body is required"),
});

/**
 * A picked file, as the file input yields one.
 */
export const fakeFile = (name = "avatar.png", type = "image/png"): File =>
  new File(["x"], name, { type });

/**
 * One field per variant, in the order the form renders them.
 */
export const fakeFields: Field<FakePayload>[] = [
  {
    type: "text",
    key: "name",
    label: "Name",
    placeholder: "Your name",
    maxLength: 40,
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
  { type: "tel", key: "phone", label: "Phone", placeholder: "+1 555 0100" },
  { type: "url", key: "site", label: "Site" },
  {
    type: "time",
    key: "alarm",
    label: "Alarm",
    min: "06:00",
    max: "22:00",
    step: 900,
  },
  { type: "datetime-local", key: "meeting", label: "Meeting" },
  {
    type: "date-input",
    key: "birthday",
    label: "Birthday",
    min: "1900-01-01",
    max: "2025-12-31",
  },
  { type: "file", key: "avatar", label: "Avatar", accept: "image/*" },
  { type: "multi-file", key: "attachments", label: "Attachments" },
  {
    type: "richtext",
    key: "body",
    label: "Body",
    features: { headings: [2], lists: false },
  },
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
  phone: "+1 555 0100",
  site: "https://example.com",
  alarm: "07:30",
  meeting: "2025-03-04T09:00",
  birthday: "1990-05-20",
  avatar: fakeFile(),
  attachments: [],
  body: "<p>Hello</p>",
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
  phone: "",
  site: "",
  alarm: "18:00",
  meeting: "2026-06-01T14:30",
  birthday: "1984-11-02",
  avatar: fakeFile("carol.png"),
  attachments: [fakeFile("notes.txt", "text/plain")],
  body: "<h2>Carol</h2>",
};

/**
 * The fake field for a payload key.
 */
export const fakeField = (key: keyof FakePayload): Field<FakePayload> => {
  const field = fakeFields.find((f) => f.key === key);
  if (!field) throw new Error(`no fake field ${key}`);
  return field;
};
