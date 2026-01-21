import { navList } from "@foundation/prose/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(navList.root, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    gap: "ref-spacing-md",
  }),

  createTokenDef(navList.group, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
  }),

  createTokenDef(navList.item, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    "padding-left": "ref-spacing-md",
    "padding-right": "ref-spacing-md",
    "padding-top": "ref-spacing-2xs",
    "padding-bottom": "ref-spacing-2xs",
    background: "ref-color-transparent",
    text: "sys-on-surface-variant",
    "text-hover": "sys-on-surface",
    "text-active": "sys-primary",
    "text-selected": "sys-primary",
    "text-selected-hover": "sys-primary",
    "text-selected-active": "sys-primary",
    "background-hover": "sys-hover",
    "background-active": "sys-hover",
    "background-selected": "sys-hover",
    "background-selected-hover": "sys-hover",
    "background-selected-active": "sys-hover",
    "box-shadow-active": "ref-shadow-border-left",
    "box-shadow-selected": "ref-shadow-border-left",
    "box-shadow-selected-hover": "ref-shadow-border-left",
    "box-shadow-selected-active": "ref-shadow-border-left",
    "background-focus": "ref-color-transparent",
    "box-shadow-focus": "ref-shadow-focus-inset",
    "background-selected-focus": "sys-hover",
    "box-shadow-selected-focus": "ref-shadow-border-left-focus",
    "text-selected-focus": "sys-primary",
    "font-size": "ref-text-sm",
    "text-decoration": "ref-decoration-none",
    cursor: "ref-cursor-pointer",
    "min-width": "ref-spacing-none",
  }),

  createTokenDef(navList.label, {
    "white-space": "ref-whitespace-nowrap",
    "overflow-x": "ref-overflow-hidden",
    "text-overflow": "ref-text-overflow-ellipsis",
    "min-width": "ref-spacing-none",
  }),
];
