import { accordion } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(accordion.trigger, {
    background: "ref-color-transparent",
    text: "sys-on-surface-variant",
    cursor: "ref-cursor-pointer",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
    "text-align": "ref-text-align-start",
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-between",
    gap: "ref-spacing-xs",
    width: "ref-full",
    "padding-left": "ref-spacing-md",
    "padding-right": "ref-spacing-md",
    "padding-top": "ref-spacing-sm",
    "padding-bottom": "ref-spacing-sm",
    "font-weight-selected": "ref-font-bold",
    "font-weight-hover": "ref-font-bold",
    "font-weight-active": "ref-font-bold",
    "font-weight-focus": "ref-font-bold",
    "font-weight-selected-hover": "ref-font-bold",
    "font-weight-selected-active": "ref-font-bold",
    "font-weight-selected-focus": "ref-font-bold",
    "background-focus": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    "background-selected-focus": "sys-hover",
    "box-shadow-selected-focus": "ref-shadow-focus-inset",
  }),

  createTokenDef(accordion.triggerContent, {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
  }),

  createTokenDef(accordion.content, {
    background: "ref-color-transparent",
    text: "sys-on-surface",
    "font-size": "ref-text-base",
  }),
];
