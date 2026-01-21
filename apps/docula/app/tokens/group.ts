import { group } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(group.key, {
    display: "ref-display-inline-flex",
    "flex-direction": "ref-flex-row",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-start",
    gap: "ref-spacing-sm",
  }),
];
