# examples/nuxt

A fake app that extends the foundation Nuxt layer and renders three pages,
the rich text editor, the calendar, and the browser, with a mock stylesheet
over the layer's tokens. It is where a change to any of them is seen
working in a real app, with real styling, before it ships.

```sh
pnpm example:nuxt   # from the repo root, after pnpm build
```

Then open the printed address. The first page holds a `RichText` bound to
an HTML string, with the HTML shown beneath as it changes. `/calendar`
holds a `Calendar` over a fake backend, an array in memory dated around
today: recurring events, an occurrence that moved and one that is off,
all-day spans, and a task. Selecting an occurrence shows it as the
JSCalendar object it is, with buttons that rename or remove the one
occurrence, it and every later one, or the whole entry. `/browser` holds a
`Browser` over a fake backend, a folder tree in memory: the search and the
sort menu in its toolbar, the trail and the listing's counts as the head of
its table, file and bulk actions that delete. Its `fetch` matches the
search within the current folder alone, and the params the next fetch is
handed are shown beneath: try `"logo"`, `Kind: Image`, or `Size: over 10`
(megabytes), then open a folder and watch the search clear.

## Layout

```
app/pages/index.vue         — the editor and its output
app/pages/calendar.vue      — the calendar and the selected occurrence
app/pages/browser.vue       — the browser and its fetch params
app/composables/team.ts     — the calendar's factory and its fake backend
app/composables/assets.ts   — the browser's factory and its fake backend
app/assets/css/app.css      — the page shell, on aurora's tokens
app/assets/css/editor.css   — the editor: toolbar, tools, separators, content
app/assets/css/calendar.css — the calendar: toolbar, grid, agenda, occurrences
app/assets/css/browser.css  — the browser: search, sort, head, rows, checkboxes
nuxt.config.ts              — extends @zoobzio/nuxt, loads the stylesheets
```

The layer ships no CSS of its own beyond a reset: every `f-*` class is a
bare hook. `editor.css`, `calendar.css`, and `browser.css` are one way to bind them, and the shape another app
would copy and change.
