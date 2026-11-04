import type { Config, Field, Option } from "../src/types";

import { describe, expect, it } from "vitest";
import { z } from "zod";
import { FormService, createFormState } from "../src";

/**
 * A payload with union-typed properties, as a Zod schema with enums
 * produces one. The config takes the schema's output type as `T`, so the
 * choice fields key the union-typed properties and type their options by
 * the union. The negative cases below are checked by `tsc`, not at runtime.
 */
const schema = z.object({
  name: z.string().min(1),
  role: z.enum(["pastor", "elder", "staff"]),
  teams: z.array(z.enum(["core", "design"])),
  plan: z.enum(["free", "pro"]).optional(),
  note: z.string().nullable(),
  count: z.number(),
});

type Payload = z.output<typeof schema>;
type Role = Payload["role"];

const roles: Option<Role>[] = [
  { value: "pastor", label: "Pastor" },
  { value: "elder", label: "Elder" },
  { value: "staff", label: "Staff" },
];

const config: Config<Payload> = {
  schema,
  fields: [
    { type: "text", key: "name", label: "Name" },
    { type: "select", key: "role", label: "Role", options: roles },
    {
      type: "multi-select",
      key: "teams",
      label: "Teams",
      options: [{ value: "core", label: "Core" }],
    },
    // An optional property narrows by its defined type.
    {
      type: "radio",
      key: "plan",
      label: "Plan",
      options: [{ value: "free", label: "Free" }],
    },
    // A nullable string property still takes any string option.
    {
      type: "select",
      key: "note",
      label: "Note",
      options: [{ value: "anything", label: "Anything" }],
    },
    // A string property accepts a union's options.
    { type: "select", key: "name", label: "Name", options: roles },
  ],
  defaults: { name: "Alice", role: "pastor", teams: [], note: null, count: 0 },
};

const wide: Option[] = [{ value: "pastor", label: "Pastor" }];
const nope: Option<"nope">[] = [{ value: "nope", label: "No" }];

export const refused: Field<Payload>[] = [
  {
    type: "select",
    key: "role",
    label: "Role",
    // @ts-expect-error a value outside the property's union
    options: nope,
  },
  // @ts-expect-error wide options cannot be proven to fit a union-typed property
  { type: "select", key: "role", label: "Role", options: wide },
  {
    type: "multi-select",
    key: "teams",
    label: "Teams",
    // @ts-expect-error an item outside the array property's union
    options: nope,
  },
  {
    type: "radio",
    key: "role",
    label: "Role",
    // @ts-expect-error a radio over a union-typed property refuses a value outside it
    options: nope,
  },
  // @ts-expect-error a number property takes no select
  { type: "select", key: "count", label: "Count", options: roles },
  // @ts-expect-error a union-typed property is not a text input
  { type: "text", key: "role", label: "Role" },
];

describe("choice fields over union-typed properties", () => {
  it("builds a service over the schema's output type", () => {
    const service = new FormService<Payload>(
      "member",
      config,
      createFormState(config),
    );
    expect(service.payload.role).toBe("pastor");
    expect(service.valid).toBe(true);
  });

  it("writes a union value through set and validates it by the schema", () => {
    const service = new FormService<Payload>(
      "member",
      config,
      createFormState(config),
    );
    service.set("role", "elder");
    service.set("teams", ["design"]);
    expect(service.payload).toMatchObject({ role: "elder", teams: ["design"] });
    expect(service.check("role")).toBe(true);
    // @ts-expect-error a value outside the union
    service.set("role", "nope");
    expect(service.check("role")).toBe(false);
  });
});
