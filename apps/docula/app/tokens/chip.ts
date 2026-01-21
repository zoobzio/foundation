import { chip } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(chip.key, {
    background: "sys-surface-container-high",
    text: "sys-on-surface",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-medium",
    "white-space": "ref-whitespace-nowrap",
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-2xs",
    "padding-left": "ref-spacing-sm",
    "padding-right": "ref-spacing-sm",
    "padding-top": "ref-spacing-2xs",
    "padding-bottom": "ref-spacing-2xs",
    "border-top-width": "ref-border-width-thin",
    "border-right-width": "ref-border-width-thin",
    "border-bottom-width": "ref-border-width-thin",
    "border-left-width": "ref-border-width-thin",
    "border-top-style": "ref-border-style-solid",
    "border-right-style": "ref-border-style-solid",
    "border-bottom-style": "ref-border-style-solid",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
  }),
];
