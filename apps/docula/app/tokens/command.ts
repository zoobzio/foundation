import { command } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(command.root, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "max-height": "ref-full",
    "overflow-x": "ref-overflow-hidden",
    "overflow-y": "ref-overflow-hidden",
  }),

  createTokenDef(command.input, {
    background: "sys-surface",
    text: "sys-on-surface",
    "border-top-width": "ref-border-width-none",
    "border-right-width": "ref-border-width-none",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-none",
    "border-top-style": "ref-border-style-none",
    "border-right-style": "ref-border-style-none",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-none",
    "border-color": "sys-outline-variant",
    "border-color-hover": "sys-outline-variant",
    "border-color-focus": "sys-outline-variant",
    "outline-width": "ref-outline-width-none",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-sm",
    "padding-left": "ref-spacing-md",
    "font-size": "ref-text-sm",
    width: "ref-full",
    "box-shadow-focus": "ref-shadow-focus-inset",
  }),

  createTokenDef(command.content, {
    position: "ref-position-relative",
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "flex-grow": "ref-flex-grow",
    "flex-shrink": "ref-flex-shrink",
    "min-height": "ref-none",
    "overflow-y": "ref-overflow-auto",
  }),

  createTokenDef(command.viewport, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    "flex-grow": "ref-flex-grow",
    "min-height": "ref-none",
  }),

  createTokenDef(command.group, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
  }),

  createTokenDef(command.label, {
    text: "sys-on-surface-variant",
    "font-size": "ref-text-xs",
    "font-weight": "ref-font-bold",
    "padding-top": "ref-spacing-sm",
    "padding-right": "ref-spacing-md",
    "padding-bottom": "ref-spacing-xs",
    "padding-left": "ref-spacing-md",
  }),

  createTokenDef(command.item, {
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
    "background-selected": "sys-hover",
    "box-shadow-focus": "ref-shadow-focus-inset",
    cursor: "ref-cursor-pointer",
    "text-align": "ref-text-align-start",
    width: "ref-full",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  }),

  createTokenDef(command.empty, {
    text: "sys-on-surface-variant",
    "font-size": "ref-text-sm",
    "text-align": "ref-text-align-center",
    "padding-top": "ref-spacing-md",
    "padding-bottom": "ref-spacing-md",
  }),
];
