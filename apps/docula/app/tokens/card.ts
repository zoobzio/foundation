import { card } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(card.key, {
    background: "sys-surface",
    "box-shadow": "ref-shadow-md",
  }),
];
