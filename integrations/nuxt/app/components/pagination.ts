// The vue pagination with the `first`, `prev`, `next`, and `last` icons as
// the content of its page controls, the layer's Select as its size control,
// and its text — the controls' names, the summary, the sizes — in the
// visitor's locale.
import Core from "@zoobzio/vue/components/pagination.vue";

import { h } from "vue";
import { iconPart } from "./icon";
import { text, textPart } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Select from "./select";

export default wrap(Core, {
  pt: (pt) => ({
    ...pt,
    first: { label: text("pagination.first"), ...pt?.first },
    prev: { label: text("pagination.previous"), ...pt?.prev },
    next: { label: text("pagination.next"), ...pt?.next },
    last: { label: text("pagination.last"), ...pt?.last },
    size: { as: Select, ...pt?.size },
  }),
  slots: {
    info: ({ page, count, total }) => [
      h(
        "span",
        { class: "f-span" },
        text("pagination.info", { page: page.value, count, total }),
      ),
    ],
    first: ({ settings }) => iconPart(settings.first, "first"),
    prev: ({ settings }) => iconPart(settings.prev, "prev"),
    next: ({ settings }) => iconPart(settings.next, "next"),
    last: ({ settings }) => iconPart(settings.last, "last"),
    // The size options read in the visitor's locale; the selected one is
    // the option of the same value among them.
    size: ({ settings }) => {
      const options = settings.size.options.map((option) => ({
        ...option,
        label: text("pagination.size", { size: Number(option.value) }),
      }));
      const current = settings.size.modelValue?.value;
      return textPart(settings.size, {
        options,
        modelValue: options.find((option) => option.value === current),
      });
    },
  },
});
