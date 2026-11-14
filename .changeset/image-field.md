---
"@zoobzio/form": patch
"@zoobzio/vue": patch
"@zoobzio/nuxt": patch
"@zoobzio/prose": patch
"@zoobzio/icons": patch
---

A form takes an `image` field. Its value is the stored image's URL, a newly picked `File`, or undefined once removed (`ImageField`, keyed to a payload property that accepts `File | string`), so an image saves with the rest of the form: the submit action uploads a `File`, keeps a string, and removes the image when the value is empty where the record held one. `accept` defaults to `image/*`. The vue form field renders it through the new `image-input.vue` (the `imageInput` control, slot and `pt` entry, the `f-data-form-image-input` class): a preview or a placeholder, a native file input, a `pick` label that opens it and a `remove` button, each a part with passthrough and a slot (`f-image-input-root`, `-preview`, `-placeholder`, `-input`, `-pick`, `-remove`). The component previews a picked file through an object URL it revokes when the model moves on or it unmounts, clears the native pick when the model stops being a file, and marks the native input `required` only while there is no image. `defineImageInput` and the `ImageInput*` types come with it. The icon contract gains `image` and `camera`. The nuxt layer wraps it with `image` in the placeholder (the new `placeholderContent` slot), `camera` before the pick label, `remove` before the remove label, and its labels in the visitor's locale (`imageInput.choose`, `imageInput.change`, `imageInput.remove`, new in the prose contract), and its form field renders the wrapped version.
