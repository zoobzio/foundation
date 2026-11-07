# examples/nuxt

A fake app that extends the foundation Nuxt layer and renders one page:
the rich text editor, with a mock stylesheet over the layer's tokens. It
is where a change to the editor is seen working in a real app, with real
styling, before it ships.

```sh
pnpm example:nuxt   # from the repo root, after pnpm build
```

Then open the printed address. The page holds a `RichText` bound to an
HTML string, with the HTML shown beneath as it changes.

## Layout

```
app/pages/index.vue       — the one page: the editor and its output
app/assets/css/app.css    — the page shell, on aurora's tokens
app/assets/css/editor.css — the editor: toolbar, tools, separators, content
nuxt.config.ts            — extends @zoobzio/nuxt, loads the two stylesheets
```

The layer ships no CSS of its own beyond a reset: every `f-*` class is a
bare hook. `editor.css` is one way to bind them, and the shape another app
would copy and change.
