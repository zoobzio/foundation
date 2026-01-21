import { main } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(main.key, {
    background: "sys-surface",
    text: "sys-on-surface",
    width: "ref-full",
    display: "ref-display-grid",
    "grid-template-columns": "ref-full",
    "grid-template-rows": "ref-grid-rows-header-content-footer",
  }),
];
