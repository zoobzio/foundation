import { input } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(input.root, {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    background: "sys-surface",
    "padding-top": "ref-spacing-xs",
    "padding-right": "ref-spacing-sm",
    "padding-bottom": "ref-spacing-xs",
    "padding-left": "ref-spacing-sm",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "border-color-hover": "sys-outline",
    "border-color-active": "sys-outline",
    "border-color-focus": "sys-outline",
    "background-hover": "sys-hover",
    "background-active": "sys-surface",
    "background-focus": "sys-surface",
    "box-shadow-focus": "ref-shadow-focus-inset",
    width: "ref-full",
  }),

  createTokenDef(input.prepend, {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    text: "sys-on-surface-variant",
  }),

  createTokenDef(input.input, {
    background: "ref-color-transparent",
    text: "sys-on-surface",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
    "flex-grow": "ref-flex-grow",
    "min-width": "ref-spacing-none",
  }),

  createTokenDef(input.append, {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    text: "sys-on-surface-variant",
  }),
];
