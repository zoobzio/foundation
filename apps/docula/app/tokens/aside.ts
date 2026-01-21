import { aside } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(aside.key, {
    display: "ref-display-block",
    background: "sys-surface",
    text: "sys-on-surface",
    "border-color": "ref-color-transparent",
    width: "ref-full",
    position: "ref-position-sticky",
    top: "ref-height-header",
  }),
];
