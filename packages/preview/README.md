# @zoobzio/preview

Headless data preview service. Pure TypeScript, no framework dependency.

Owns: one record, its load flag, and the init guard; reads the record by
field and by the configured content key. Delegates: data loading (`fetch`)
and state storage (the container). Clipboard, download, and links are the
caller's — the service is DOM-free.

## Usage

```ts
import { PreviewService, createPreviewState } from "@zoobzio/preview";

const config = {
  fields: [
    { key: "name", label: "Name" },
    { key: "status", label: "Status" },
  ],
  content: { type: "code", key: "body", language: "javascript" },
};

const preview = new PreviewService("contact", config, createPreviewState(), {
  fetch: async () => api.contact(42),
});

await preview.init();
preview.contentValue; // String(data.body)
preview.fieldValue("name");
await preview.fetch(); // reload
```

## The state container

The service reads and writes the `state` container: the record, the load
flag, and the init guard. The container can be a plain object or a reactive
proxy. The service replaces each member as a whole, so a proxy tracks every
change.

```ts
createPreviewState(); // plain: tests, Node
reactive(createPreviewState()); // Vue
useState(`preview-${id}`, () => createPreviewState()).value; // Nuxt, shared by id
```

## Middleware

`options.get.state.<field>` and `options.set.state.<field>` receive the value
of the field and return the value the service uses. A missing slot passes the
value on.

```ts
new PreviewService(id, config, state, wiring, {
  set: { state: { data: (data) => (data ? redact(data) : null) } },
});
```

## Events

`on(event, listener)` subscribes. Listeners run in subscription order, after
the write lands. The return value removes the listener.

- `change`: a field of the container was written. `{ field, before, after }`, narrowed by `field`.
- `loaded`: a fetch settled, success or failure. `{ id }`.

```ts
const off = preview.on("loaded", ({ id }) => console.log(`${id} loaded`));
```
