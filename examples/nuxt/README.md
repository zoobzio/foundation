# examples/nuxt

A fake app that extends the foundation Nuxt layer and renders two pages,
the rich text editor and the calendar, with a mock stylesheet over the
layer's tokens. It is where a change to either is seen working in a real
app, with real styling, before it ships.

```sh
pnpm example:nuxt   # from the repo root, after pnpm build
```

Then open the printed address. The first page holds a `RichText` bound to
an HTML string, with the HTML shown beneath as it changes. `/calendar`
holds a `Calendar` over a fake backend, an array in memory dated around
today: recurring events, an occurrence that moved and one that is off,
all-day spans, and a task. Selecting an occurrence shows it as the
JSCalendar object it is, with buttons that rename or remove the one
occurrence, it and every later one, or the whole entry.

## Layout

```
app/pages/index.vue         — the editor and its output
app/pages/calendar.vue      — the calendar and the selected occurrence
app/composables/team.ts     — the calendar's factory and its fake backend
app/assets/css/app.css      — the page shell, on aurora's tokens
app/assets/css/editor.css   — the editor: toolbar, tools, separators, content
app/assets/css/calendar.css — the calendar: toolbar, grid, agenda, occurrences
nuxt.config.ts              — extends @zoobzio/nuxt, loads the stylesheets
```

The layer ships no CSS of its own beyond a reset: every `f-*` class is a
bare hook. `editor.css` and `calendar.css` are one way to bind them, and the shape another app
would copy and change.
