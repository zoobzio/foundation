import { footer } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(footer.key, {
    background: "sys-void",
    text: "sys-on-surface",
    gap: "ref-spacing-md",
    display: "ref-display-grid",
    "grid-template-columns": "ref-layout-trifold",
    "grid-column": "ref-grid-col-2",
    "align-items": "ref-align-center",
    "border-top-style": "ref-border-style-solid",
    "border-top-width": "ref-border-width-thin",
    "border-color": "sys-outline",
  }),
];
