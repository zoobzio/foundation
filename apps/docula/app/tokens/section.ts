import { section } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(section.key, {
    background: "ref-color-transparent",
    text: "sys-on-surface",
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    gap: "ref-spacing-lg",
    "padding-right": "ref-spacing-lg",
    "padding-bottom": "ref-spacing-lg",
    "padding-left": "ref-spacing-lg",
    "min-width": "ref-none",
  }),
];
