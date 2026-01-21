import { attribution } from "@foundation/prose/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(attribution.root, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    "align-items": "ref-align-center",
    gap: "ref-spacing-md",
    text: "sys-on-surface-variant",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
    width: "ref-full",
    "padding-top": "ref-spacing-sm",
    "padding-bottom": "ref-spacing-sm",
  }),

  createTokenDef(attribution.author, {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    text: "sys-on-surface-variant",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
    "white-space": "ref-whitespace-nowrap",
    "line-height": "ref-leading-none",
  }),

  createTokenDef(attribution.published, {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    text: "sys-muted",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-normal",
    "white-space": "ref-whitespace-nowrap",
  }),

  createTokenDef(attribution.readtime, {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    text: "sys-muted",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-normal",
    "white-space": "ref-whitespace-nowrap",
  }),

  createTokenDef(attribution.edit, {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    text: "sys-muted",
    "text-hover": "sys-on-surface",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-normal",
    "font-weight-hover": "ref-font-normal",
    "font-weight-focus": "ref-font-normal",
    "white-space": "ref-whitespace-nowrap",
    "margin-left": "ref-auto",
    "text-decoration": "ref-decoration-none",
    "text-decoration-hover": "ref-decoration-underline",
    cursor: "ref-cursor-pointer",
    "box-shadow-focus": "ref-shadow-focus-ring",
  }),
];
