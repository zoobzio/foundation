import { label } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(label.key, {
    text: "sys-on-surface",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-medium",
    display: "ref-display-block",
  }),
];
