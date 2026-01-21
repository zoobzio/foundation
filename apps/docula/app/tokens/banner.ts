import { banner } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(banner.key, {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
    gap: "ref-spacing-sm",
    "padding-top": "ref-spacing-sm",
    "padding-bottom": "ref-spacing-sm",
    "padding-left": "ref-spacing-md",
    "padding-right": "ref-spacing-md",
    background: "sys-surface-container",
    text: "sys-on-surface",
  }),
];
