# @zoobzio/form

Headless data form service. Pure TypeScript, no framework dependency.

Owns: the payload, per-key and whole-schema validation against a Zod
schema, the touched set, and the submit lifecycle. Delegates: the init and
submit side effects (`actions`), per-key value middleware, and state storage
(the container).

## Usage

```ts
import { FormService, createFormState } from "@zoobzio/form";
import { z } from "zod";

const config = {
  title: "Contact",
  fields: [
    { type: "text", key: "name", label: "Name" },
    { type: "email", key: "email", label: "Email", hint: "Never shared" },
  ],
  schema: z.object({ name: z.string().min(1), email: z.string().email() }),
  defaults: { name: "" },
};

const form = new FormService("contact", config, createFormState(config), {
  init: async (form) => form.update(await api.contact()),
  submit: async (form) => api.save(form.payload),
  middleware: { name: (name) => name.trim() },
});

await form.initialize();
form.set("email", "alice@example.com");
form.check("email"); // one key → errors
form.validate(); // whole schema → errors + touched
await form.submit(); // validate → action → submitted
form.reset(); // back to defaults
form.field("email"); // { value, error, touched } — error only once touched
```

## Fields

`config.fields` is pure data: each entry names a payload key, the control
its `type` renders, and the control's own settings. `key` may only point
at a payload property that accepts the control's value.

| Type                                      | Value       | Settings                                   |
| ----------------------------------------- | ----------- | ------------------------------------------ |
| `text`, `email`, `password`, `tel`, `url` | `string`    | `placeholder`, `maxLength`                 |
| `number`                                  | `number`    | `placeholder`, `min`, `max`, `step`        |
| `textarea`                                | `string`    | `placeholder`, `rows`, `maxLength`         |
| `select`, `radio`                         | `string`¹   | `options` (+ `placeholder`, `orientation`) |
| `multi-select`                            | `string[]`¹ | `options`, `placeholder`                   |
| `checkbox`                                | `boolean`   |                                            |
| `date`                                    | `Date`      | `placeholder`, `minDate`, `maxDate`        |
| `time`, `datetime-local`, `date-input`    | `string`    | `min`, `max`, `step`                       |
| `tags-input`                              | `string[]`  | `placeholder`, `max`, `delimiter`          |
| `file`                                    | `File`      | `accept`, `capture`                        |
| `multi-file`                              | `File[]`    | `accept`, `capture`                        |
| `richtext`                                | `string`    | `features`                                 |

¹ Or the property's own string literal union. A choice field (`select`,
`radio`, `multi-select`) over `role: "admin" | "member"` keys that property
and its `options` are `Option<"admin" | "member">[]`, so a value outside the
union is a type error and the config can take the schema's output type as
`T` directly. Over a plain `string` property the options stay
`Option<string>[]`. `Option<V>` is the option shape with `V` as the value.

```ts
const schema = z.object({ role: z.enum(["admin", "member"]) });
type Payload = z.output<typeof schema>;
const roles: Option<Payload["role"]>[] = [
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
];
const config: Config<Payload> = {
  title: "Member",
  schema,
  fields: [{ type: "select", key: "role", label: "Role", options: roles }],
};
```

A `file` field holds the picked `File` and a `multi-file` field the picked
files; limits on size, type, and count belong to the schema (`z.file()`,
`z.array(z.file())`). A `richtext` field holds the document as an HTML
string, so the schema validates a string and the payload stays
serializable; an empty document writes `""`, so `z.string().min(1)` marks
it required. `features` is the editor's feature set (`headings`, `lists`,
`links`, `code`, `blockquote`, `rule`, `history`), each on unless turned
off.

```ts
const fields: Field<Post>[] = [
  { type: "file", key: "cover", label: "Cover", accept: "image/*" },
  {
    type: "richtext",
    key: "body",
    label: "Body",
    features: { headings: [2, 3] },
  },
];
const schema = z.object({
  cover: z.file().max(5_000_000).mime(["image/png", "image/jpeg"]),
  body: z.string().min(1, "Body is required"),
});
```

## The state container

The service reads and writes the `state` container: the payload, the
errors, the touched keys, and the lifecycle flags. The container can be a
plain object or a reactive proxy. The service replaces each member as a
whole, so a proxy tracks every change.

```ts
createFormState(config); // plain: tests, Node
reactive(createFormState(config)); // Vue
useState(`form-${id}`, () => createFormState(config)).value; // Nuxt, shared by id
```

## Middleware

`options.get.state.<field>` and `options.set.state.<field>` receive the value
of the field and return the value the service uses. A missing slot passes the
value on. (`actions.middleware.<key>` is different: it shapes one payload
value on `set`.)

```ts
new FormService(id, config, state, wiring, {
  set: { state: { touched: (touched) => new Set(touched) } },
});
```

## Events

`on(event, listener)` subscribes. Listeners run in subscription order, after
the write lands. The return value removes the listener.

- `change`: a field of the container was written. `{ field, before, after }`, narrowed by `field`.
- `initialized`: the init lifecycle ran. `{ id, data }` — the payload.
- `submitted`: the submit action settled on a valid payload. `{ id, data }`.
- `rejected`: submit stopped on validation. `{ id, data, errors }`.
- `restored`: a record passed the schema and replaced the payload. `{ id, data }`.
- `reset`: the payload returned to the defaults. `{ id, data }`.
- `failed`: the init action, a restore, or the submit action threw; the error is rethrown after the event, so an `await` on the method sees it. `{ id, stage, cause }` — `stage` is `"init" | "restore" | "submit"`. A caller with no use for the rejection, a submit handler for one, catches it; the event is the channel.

```ts
const off = form.on("rejected", ({ errors }) => focusFirst(errors));
```
