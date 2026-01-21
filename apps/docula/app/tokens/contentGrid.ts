import { contentGrid } from "@foundation/prose/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(contentGrid.root, {
    display: "ref-display-grid",
    "grid-template-columns": "ref-layout-grid-3",
    gap: "ref-spacing-none",
  }),

  createTokenDef(contentGrid.item, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "align-items": "ref-align-start",
    "justify-content": "ref-justify-start",
    gap: "ref-spacing-xs",
    "padding-top": "ref-spacing-md",
    "padding-right": "ref-spacing-lg",
    "padding-bottom": "ref-spacing-md",
    "padding-left": "ref-spacing-lg",
    "text-decoration": "ref-decoration-none",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "ref-color-transparent",
    "border-color-hover": "sys-outline",
    "border-color-active": "sys-outline",
    "border-color-focus": "sys-outline",
    "background-hover": "sys-hover",
    "background-focus": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    cursor: "ref-cursor-pointer",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  }),

  createTokenDef(contentGrid.title, {
    text: "sys-on-surface",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
  }),

  createTokenDef(contentGrid.description, {
    text: "sys-on-surface-variant",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-normal",
  }),

  createTokenDef(contentGrid.meta, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    gap: "ref-spacing-sm",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-between",
    width: "ref-full",
  }),

  createTokenDef(contentGrid.author, {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-2xs",
    text: "sys-on-surface-variant",
    "font-size": "ref-text-xs",
    "font-weight": "ref-font-normal",
    "white-space": "ref-whitespace-nowrap",
  }),

  createTokenDef(contentGrid.published, {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-2xs",
    text: "sys-on-surface-variant",
    "font-size": "ref-text-xs",
    "font-weight": "ref-font-normal",
    "white-space": "ref-whitespace-nowrap",
  }),
];
