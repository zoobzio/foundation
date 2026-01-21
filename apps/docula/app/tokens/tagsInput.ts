import { tagsInput } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(tagsInput.root, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    "flex-wrap": "ref-flex-wrap",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    background: "sys-surface",
    text: "sys-on-surface",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-sm",
    "padding-left": "ref-spacing-md",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
  }),

  createTokenDef(tagsInput.item, {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-2xs",
    background: "sys-surface-container-high",
    text: "sys-on-surface",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-medium",
    "white-space": "ref-whitespace-nowrap",
    "padding-left": "ref-spacing-sm",
    "padding-right": "ref-spacing-sm",
    "padding-top": "ref-spacing-2xs",
    "padding-bottom": "ref-spacing-2xs",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  }),

  createTokenDef(tagsInput.itemText, {
    "font-size": "ref-text-sm",
  }),

  createTokenDef(tagsInput.itemDelete, {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
    background: "ref-color-transparent",
    "background-hover": "sys-hover",
    text: "sys-on-surface-variant",
    "text-hover": "sys-on-surface",
    cursor: "ref-cursor-pointer",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  }),

  createTokenDef(tagsInput.input, {
    background: "ref-color-transparent",
    text: "sys-on-surface",
    "font-size": "ref-text-base",
    "flex-grow": "ref-flex-1",
    "min-width": "ref-width-xs",
  }),
];
