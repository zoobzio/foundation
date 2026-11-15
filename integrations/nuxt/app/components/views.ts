// The vue views with the layer's parts behind its own: the layer's Tabs
// (so a view's name reads from the contract where it is a key of it), its
// Menu, its Fab behind the menu, and its Dialog for the confirmation and
// for naming a view. The menu's trigger draws the `settings` icon before
// its label and `expand` after it. Its own text — the actions, the dialogs' titles,
// bodies and buttons, the name of the mark on an edited view's tab —
// reads in the visitor's locale.
import Core from "@zoobzio/vue/components/views.vue";

import { h } from "vue";
import { wrap } from "@zoobzio/vue/utils/wrap";
import Dialog from "./dialog";
import Fab from "./fab";
import Menu from "./menu";
import Tabs from "./tabs";
import { icon } from "./icon";
import { text, textIn, textSlot } from "./text";

export default wrap(Core, {
  // The layer's Fab and Dialog resolve the texts they are handed, so a
  // part names a key of the contract and never calls `text` out of a
  // render.
  pt: {
    tabs: { as: Tabs },
    menu: { as: Menu },
    trigger: { as: Fab, label: "views.menu" },
    confirm: (kind) => ({
      as: Dialog,
      title: `views.${kind}Title`,
      description: `views.${kind}Description`,
    }),
    naming: (mode) => ({
      as: Dialog,
      title: `views.${mode}Title`,
      description: "views.nameDescription",
    }),
  },
  slots: {
    badge: ({ option }) =>
      option.drifted
        ? [
            h("span", {
              class: "f-span f-views-badge",
              role: "img",
              "aria-label": text("views.edited"),
            }),
          ]
        : [],
    // The trigger part with the icons around its label. The label is the
    // part's own, so a consumer's `pt.trigger.label` still names it.
    trigger: ({ settings }) => {
      const { as, ...props } = settings.trigger;
      return [
        h(as, props, () => [
          icon("settings"),
          h("span", { class: "f-span" }, text(props.label ?? "views.menu")),
          icon("expand"),
        ]),
      ];
    },
    actionLabel: ({ item }) =>
      textIn("span", "f-span", text(`views.${item.key}`)),
    nameLabel: () => textSlot("views.name"),
    cancelLabel: () => textSlot("views.cancel"),
    saveLabel: () => textSlot("views.save"),
    proceedLabel: ({ kind }) => textSlot(`views.${kind}Proceed`),
  },
});
