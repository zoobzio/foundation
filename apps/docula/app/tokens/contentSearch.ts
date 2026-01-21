import { contentSearch } from "@foundation/prose/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(contentSearch.root, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "max-height": "ref-full",
    "overflow-y": "ref-overflow-hidden",
  }),

  createTokenDef(contentSearch.status, {
    text: "sys-on-surface-variant",
    "font-size": "ref-text-sm",
    "text-align": "ref-text-align-center",
    "padding-top": "ref-spacing-md",
    "padding-bottom": "ref-spacing-md",
  }),

  createTokenDef(contentSearch.results, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "flex-grow": "ref-flex-grow",
    "flex-shrink": "ref-flex-shrink",
    "min-height": "ref-none",
    "overflow-y": "ref-overflow-auto",
  }),

  createTokenDef(contentSearch.result, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-sm",
    "padding-left": "ref-spacing-md",
    background: "ref-color-transparent",
    "background-hover": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    cursor: "ref-cursor-pointer",
    "text-align": "ref-text-align-start",
    width: "ref-full",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  }),

  createTokenDef(contentSearch.resultTitle, {
    text: "sys-on-surface",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-bold",
    "white-space": "ref-whitespace-nowrap",
    "overflow-x": "ref-overflow-hidden",
    "text-overflow": "ref-text-overflow-ellipsis",
  }),

  createTokenDef(contentSearch.group, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
  }),

  createTokenDef(contentSearch.groupTitle, {
    text: "sys-on-surface-variant",
    "font-size": "ref-text-xs",
    "font-weight": "ref-font-bold",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-xs",
    "padding-left": "ref-spacing-md",
  }),

  createTokenDef(contentSearch.resultSeparator, {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
    text: "sys-on-surface-variant",
  }),

  createTokenDef(contentSearch.resultDate, {
    text: "sys-on-surface-variant",
    "font-size": "ref-text-xs",
    "margin-left": "ref-auto",
    "white-space": "ref-whitespace-nowrap",
  }),
];
