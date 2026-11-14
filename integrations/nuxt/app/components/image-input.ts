// The vue image input with its pick and remove labels in the visitor's
// locale, the `image` icon in its placeholder, and the `camera` and
// `remove` icons before the pick and remove labels.
import Core from "@zoobzio/vue/components/image-input.vue";

import { icon } from "./icon";
import { textIn } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";

export default wrap(Core, {
  slots: {
    placeholderContent: () => [icon("image")],
    pickPrepend: () => [icon("camera")],
    pickText: ({ src }) =>
      textIn("span", "f-span", src ? "imageInput.change" : "imageInput.choose"),
    removePrepend: () => [icon("remove")],
    removeText: () => textIn("span", "f-span", "imageInput.remove"),
  },
});
