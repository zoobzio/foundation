import { dialog } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(dialog.overlay, {
    background: "sys-surface",
    opacity: "ref-opacity-50",
    position: "ref-position-fixed",
    top: "ref-position-zero",
    left: "ref-position-zero",
    right: "ref-position-zero",
    bottom: "ref-position-zero",
    "z-index": "ref-z-overlay",
  }),

  createTokenDef(dialog.content, {
    background: "sys-surface-container",
    text: "sys-on-surface",
    position: "ref-position-fixed",
    top: "ref-position-half",
    left: "ref-position-half",
    transform: "ref-transform-center",
    width: "ref-width-xl",
    "max-height": "ref-viewport-60",
    "overflow-y": "ref-overflow-hidden",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "z-index": "ref-z-modal",
  }),

  createTokenDef(dialog.title, {
    display: "ref-display-block",
    text: "sys-on-surface",
    "font-size": "ref-text-lg",
    "font-weight": "ref-font-bold",
    "padding-top": "ref-spacing-md",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-xs",
    "padding-left": "ref-spacing-md",
  }),

  createTokenDef(dialog.description, {
    display: "ref-display-block",
    text: "sys-on-surface-variant",
    "font-size": "ref-text-sm",
    "padding-top": "ref-spacing-xs",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-md",
    "padding-left": "ref-spacing-md",
    "border-bottom-width": "ref-border-width-thin",
    "border-bottom-style": "ref-border-style-solid",
    "border-color": "sys-outline-variant",
  }),
];
