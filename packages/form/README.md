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
    { type: "email", key: "email", label: "Email" },
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
- `failed`: the init action, a restore, or the submit action threw; the error is rethrown after the event. `{ id, stage, cause }` — `stage` is `"init" | "restore" | "submit"`.

```ts
const off = form.on("rejected", ({ errors }) => focusFirst(errors));
```
