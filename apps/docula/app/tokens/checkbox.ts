import { checkbox } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(checkbox.root, {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
    width: "ref-spacing-lg",
    height: "ref-spacing-lg",
    background: "sys-surface",
    "background-hover": "sys-hover",
    "background-selected": "sys-primary",
    "background-selected-hover": "sys-primary-hover",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
    "border-color-selected": "sys-primary",
    "border-top-left-radius": "ref-radius-sm",
    "border-top-right-radius": "ref-radius-sm",
    "border-bottom-right-radius": "ref-radius-sm",
    "border-bottom-left-radius": "ref-radius-sm",
    cursor: "ref-cursor-pointer",
    "cursor-disabled": "ref-cursor-not-allowed",
    "opacity-disabled": "ref-opacity-50",
    "transition-duration": "ref-duration-fast",
    "transition-easing": "ref-ease-out",
  }),

  createTokenDef(checkbox.indicator, {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
    text: "sys-on-primary",
    "font-size": "ref-text-sm",
  }),
];
