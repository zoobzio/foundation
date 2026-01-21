import { link } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(link.key, {
    text: "sys-primary",
    "text-hover": "sys-primary-hover",
    "text-decoration": "ref-none",
  }),
];
