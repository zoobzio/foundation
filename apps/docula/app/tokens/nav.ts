import { nav } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(nav.key, {
    background: "ref-color-transparent",
    text: "sys-on-surface",
    position: "ref-position-sticky",
    top: "ref-position-zero",
  }),
];
