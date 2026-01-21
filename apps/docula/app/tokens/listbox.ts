import { listbox } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(listbox.root, {
    background: "ref-color-transparent",
  }),

  createTokenDef(listbox.content, {
    background: "ref-color-transparent",
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    gap: "ref-spacing-none",
  }),

  createTokenDef(listbox.item, {
    background: "ref-color-transparent",
    text: "sys-on-surface-variant",
    "text-hover": "sys-on-surface",
    "text-active": "sys-primary",
    "text-selected": "sys-primary",
    "text-selected-hover": "sys-primary",
    "background-hover": "sys-hover",
    "background-selected": "sys-surface-container-high",
    "background-selected-hover": "sys-hover",
    "box-shadow-selected": "ref-shadow-border-left",
    "box-shadow-selected-hover": "ref-shadow-border-left",
    "box-shadow-selected-active": "ref-shadow-border-left",
    "border-color": "ref-color-transparent",
    "padding-left": "ref-spacing-md",
    "padding-right": "ref-spacing-md",
    "padding-top": "ref-spacing-xs",
    "padding-bottom": "ref-spacing-xs",
    cursor: "ref-cursor-pointer",
    "cursor-disabled": "ref-cursor-not-allowed",
    "font-size": "ref-text-base",
    "text-selected-active": "sys-primary",
    "text-selected-focus": "sys-primary",
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-between",
    gap: "ref-spacing-sm",
    "background-focus": "ref-color-transparent",
    "box-shadow-focus": "ref-shadow-focus-inset",
    "background-selected-focus": "sys-surface-container-high",
    "box-shadow-selected-focus": "ref-shadow-border-left-focus",
  }),
];
