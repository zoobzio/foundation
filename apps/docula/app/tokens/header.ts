import { header } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(header.key, {
    background: "sys-surface",
    text: "sys-on-surface",
    gap: "ref-spacing-md",
    display: "ref-display-grid",
    "grid-template-columns": "ref-layout-trifold",
    "grid-column": "ref-grid-col-span-all",
    "align-items": "ref-align-center",
    "border-bottom-style": "ref-border-style-solid",
    "border-bottom-width": "ref-border-width-thin",
    "border-color": "sys-outline",
    width: "ref-full",
    height: "ref-height-header",
    "padding-left": "ref-spacing-md",
    "padding-right": "ref-spacing-md",
    position: "ref-position-sticky",
    top: "ref-position-zero",
    "z-index": "ref-z-sticky",
  }),
];
