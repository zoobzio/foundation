import { search } from "../../elements.config";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(search.root, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "min-width": "ref-width-xl",
    "max-height": "ref-spacing-2xl",
  }),

  createTokenDef(search.results, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "overflow-y": "ref-overflow-auto",
    background: "sys-surface-container",
    text: "sys-on-surface",
    "padding-top": "ref-spacing-xs",
    "padding-bottom": "ref-spacing-xs",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "z-index": "ref-z-popover",
  }),

  createTokenDef(search.item, {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    "padding-left": "ref-spacing-sm",
    "padding-right": "ref-spacing-sm",
    "padding-top": "ref-spacing-xs",
    "padding-bottom": "ref-spacing-xs",
    cursor: "ref-cursor-pointer",
    background: "ref-color-transparent",
    "background-hover": "sys-hover",
    "background-selected": "sys-hover",
    "background-selected-hover": "sys-hover",
    "background-focus": "sys-hover",
  }),

  createTokenDef(search.icon, {
    "font-size": "ref-text-base",
    text: "sys-muted",
  }),

  createTokenDef(search.breadcrumb, {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    "font-size": "ref-text-sm",
  }),

  createTokenDef(search.separator, {
    "font-size": "ref-text-xs",
    text: "sys-muted",
    opacity: "ref-opacity-50",
  }),

  createTokenDef(search.empty, {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
    "padding-top": "ref-spacing-md",
    "padding-bottom": "ref-spacing-md",
    text: "sys-muted",
    "font-size": "ref-text-sm",
  }),
];
