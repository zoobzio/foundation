# @zoobzio/chart

Headless data chart service. Pure TypeScript, no framework dependency.

Owns: the active selection — variant, renderer, field, group, axes, bucket,
range — and the fetched variant data. Delegates: data loading (one fetcher
per declared variant), state storage (the container), and rendering (the
service carries renderer `options` through untouched and never touches a
canvas).

## Usage

```ts
import { ChartService, createChartState } from "@zoobzio/chart";

const config = {
  topic: "contacts",
  breakdown: {
    fields: ["status", "name"],
    renderers: [{ type: "pie" }, { type: "bar" }],
    limit: 5,
  },
  series: {
    fields: ["amount"],
    renderers: [{ type: "line" }],
    buckets: ["1d", "1w"],
    defaultRange: [start, end],
  },
};

const chart = new ChartService("contacts", config, createChartState(config), {
  breakdown: async (params) => api.breakdown(params),
  series: async (params) => api.series(params),
});

await chart.init();
chart.setVariant("series"); // resets field, renderer, bucket, range; refetches
chart.setBucket("1w"); // refetches
chart.setRenderer("bar"); // no refetch — rendering only
```

A variant exists iff the config declares it, and the service skips a fetch
whose action is missing or whose inputs are not set. A breakdown result is
collapsed to its top `limit` slices plus "Other".

## The state container

The service reads and writes the `state` container: the load flags, the
variant data, and the active selection. The container can be a plain object
or a reactive proxy. The service replaces each member as a whole, so a proxy
tracks every change.

```ts
createChartState(config); // plain: tests, Node
reactive(createChartState(config)); // Vue
useState(`chart-${id}`, () => createChartState(config)).value; // Nuxt, shared by id
```

## Middleware

`options.get.state.<field>` and `options.set.state.<field>` receive the value
of the field and return the value the service uses. A missing slot passes the
value on.

```ts
new ChartService(id, config, state, wiring, {
  set: { state: { activeRange: ([a, b]) => [startOfDay(a), endOfDay(b)] } },
});
```

## Events

`on(event, listener)` subscribes. Listeners run in subscription order, after
the write lands. The return value removes the listener.

- `change`: a field of the container was written. `{ field, before, after }`, narrowed by `field`.
- `updated`: a fetch settled. `{ id, variant, data }` — the variant data.
- `variantChanged`: the active variant was switched. `{ id, variant }`.
- `rendererChanged`: the active renderer was switched. `{ id, renderer }`.

```ts
const off = chart.on("updated", ({ data }) => paint(data));
```
