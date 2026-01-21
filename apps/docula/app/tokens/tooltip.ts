import { tooltip } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(tooltip.content, {
    background: "sys-surface-container",
    text: "sys-on-surface",
    "font-size": "ref-text-sm",
    "padding-left": "ref-spacing-xs",
    "padding-right": "ref-spacing-xs",
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
    "z-index": "ref-z-tooltip",
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
  }),
];
