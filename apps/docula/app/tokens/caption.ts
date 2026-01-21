import { caption } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(caption.key, {
    background: "ref-color-transparent",
    text: "sys-on-surface-variant",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    "padding-left": "ref-spacing-md",
    "padding-right": "ref-spacing-md",
    "padding-top": "ref-spacing-sm",
    "padding-bottom": "ref-spacing-sm",
  }),
];
