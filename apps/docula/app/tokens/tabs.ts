import { tabs } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(tabs.root, {
    background: "ref-color-transparent",
  }),

  createTokenDef(tabs.list, {
    background: "ref-color-transparent",
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    gap: "ref-spacing-none",
    "border-bottom-width": "ref-border-width-thin",
    "border-bottom-style": "ref-border-style-solid",
    "border-color": "sys-outline",
  }),

  createTokenDef(tabs.trigger, {
    background: "ref-color-transparent",
    text: "sys-on-surface-variant",
    "text-hover": "sys-on-surface",
    "text-active": "sys-primary",
    "text-selected": "sys-primary",
    "text-selected-hover": "sys-primary",
    "text-selected-active": "sys-primary",
    "text-selected-focus": "sys-primary",
    "background-selected": "sys-surface-container-high",
    "border-bottom-width": "ref-hairline",
    "box-shadow-selected": "ref-shadow-border-bottom",
    "box-shadow-selected-hover": "ref-shadow-border-bottom",
    "box-shadow-selected-active": "ref-shadow-border-bottom",
    cursor: "ref-cursor-pointer",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
    "font-weight-hover": "ref-font-bold",
    "font-weight-active": "ref-font-bold",
    "font-weight-focus": "ref-font-bold",
    "font-weight-selected": "ref-font-bold",
    "font-weight-selected-hover": "ref-font-bold",
    "font-weight-selected-active": "ref-font-bold",
    "font-weight-selected-focus": "ref-font-bold",
    "padding-left": "ref-spacing-lg",
    "padding-right": "ref-spacing-lg",
    "padding-top": "ref-spacing-md",
    "padding-bottom": "ref-spacing-md",
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
    gap: "ref-spacing-md",
    "background-focus": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    "background-selected-focus": "sys-hover",
    "box-shadow-selected-focus": "ref-shadow-border-bottom-focus",
  }),

  createTokenDef(tabs.content, {
    background: "ref-color-transparent",
    text: "sys-on-surface",
    "font-size": "ref-text-base",
  }),
];
