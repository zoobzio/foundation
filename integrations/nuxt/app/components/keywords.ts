// The vue keywords with the layer's TagsInput and SegmentedControl behind
// its controls, the `keywords` icon as its trigger's content, and its text
// — the trigger, the section headings, the placeholders, the match modes —
// in the visitor's locale.
import Core from "@zoobzio/vue/components/keywords.vue";

import { h } from "vue";
import { iconPart } from "./icon";
import { text } from "./text";
import { wrap } from "@zoobzio/vue/utils/wrap";
import SegmentedControl from "./segmented-control";
import TagsInput from "./tags-input";

const caption = (label: string) => [
  h("div", { class: "f-caption f-keywords-label" }, label),
];

export default wrap(Core, {
  pt: (pt) => ({
    ...pt,
    trigger: { label: text("keywords.trigger"), ...pt?.trigger },
    includeInput: {
      as: TagsInput,
      placeholder: text("keywords.include"),
      ...pt?.includeInput,
    },
    excludeInput: {
      as: TagsInput,
      placeholder: text("keywords.exclude"),
      ...pt?.excludeInput,
    },
    matchControl: {
      as: SegmentedControl,
      options: [
        { value: "and", label: text("keywords.and") },
        { value: "or", label: text("keywords.or") },
      ],
      ...pt?.matchControl,
    },
  }),
  slots: {
    trigger: ({ settings }) => iconPart(settings.trigger, "keywords"),
    includeLabel: () => caption(text("keywords.includeLabel")),
    excludeLabel: () => caption(text("keywords.excludeLabel")),
    matchLabel: () => caption(text("keywords.match")),
  },
});
