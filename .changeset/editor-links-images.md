---
"@zoobzio/editor": patch
"@zoobzio/vue": patch
"@zoobzio/nuxt": patch
"@zoobzio/prose": patch
"@zoobzio/icons": patch
---

The editor takes links and images. `@zoobzio/editor` gains `images` in its config, on unless turned off: an inline image node holding a `src`, an `alt`, and a `title`, which `insert({ type: "image", attrs })` adds at the selection. It is inline, as an image is in HTML and in Markdown, so `<p>text <img> text</p>` and `![alt](src)` read and write back as they were. The editor stores the address and nothing else. `link(href)` sets the link over the selection, or over the whole link the caret is in, or, with the caret in plain text, inserts the `href` as the link's text; `link(null)` removes it; an `href` of a protocol the link extension refuses changes nothing. `attributes(name)` reads the attributes of a mark or node at the selection. A click on a link in the editor now places the caret and no longer follows the link.

A document that held an `<img>` lost it on load; it is now kept, in `rich-text.vue` too. Turn `images` off to drop them as before.

The Vue `editor.vue` and `rich-text.vue` add two tools, each a `prompt`, a new tool kind: the button opens a Popover over a form and the tool runs with what was typed. `link`, after the marks, asks for an address, opens on the address of the link at the selection, and offers to remove it. `image`, in a new `media` group before history, asks for an address and an alternative text, and over a selected image opens on its values and replaces them. `pt.prompt`, `pt.form`, `pt.field`, `pt.submit`, and `pt.clear` reach the parts; the `prompt` slot replaces the form of every prompt and `prompt-<key>` that of one tool alone (`prompt-image`, `prompt-link`), so an app's own image picker leaves the link's form as it is, and `fieldLabel`, `submitLabel`, and `clearLabel` fill the default form. A prompt's button carries `data-active` where its link or image is at the selection.

The Nuxt layer draws the two tools as the `link` and `image` icons, `link` a new alias of the icon contract, and reads their labels and their prompts' in the visitor's locale, from the new `editor.link`, `editor.image`, `editor.url`, `editor.alt`, `editor.apply`, and `editor.remove` messages of the prose contract; `EDITOR_FIELD_TEXT` maps a prompt's fields to them.
