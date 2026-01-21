import { toc } from "@foundation/prose/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(toc.root, {
    background: "ref-color-transparent",
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
  }),

  createTokenDef(toc.content, {
    background: "ref-color-transparent",
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    gap: "ref-spacing-none",
  }),

  createTokenDef(toc.item, {
    background: "ref-color-transparent",
    text: "sys-on-surface-variant",
    "text-hover": "sys-on-surface",
    "text-active": "sys-primary",
    "text-selected": "sys-primary",
    "text-selected-hover": "sys-primary",
    "text-selected-active": "sys-primary",
    "text-selected-focus": "sys-primary",
    "background-hover": "ref-color-transparent",
    "background-focus": "ref-color-transparent",
    "background-selected": "ref-color-transparent",
    "background-selected-hover": "ref-color-transparent",
    "background-selected-focus": "ref-color-transparent",
    "box-shadow-focus": "ref-shadow-focus-inset",
    "box-shadow-selected": "ref-shadow-border-left",
    "box-shadow-selected-hover": "ref-shadow-border-left",
    "box-shadow-selected-active": "ref-shadow-border-left",
    "box-shadow-selected-focus": "ref-shadow-border-left-focus",
    "border-color": "ref-color-transparent",
    "padding-left": "ref-spacing-xs",
    "padding-right": "ref-spacing-xs",
    "padding-top": "ref-spacing-2xs",
    "padding-bottom": "ref-spacing-2xs",
    cursor: "ref-cursor-pointer",
    "font-size": "ref-text-sm",
    display: "ref-display-block",
    "white-space": "ref-whitespace-nowrap",
    "overflow-x": "ref-overflow-hidden",
    "text-overflow": "ref-text-overflow-ellipsis",
  }),
];
