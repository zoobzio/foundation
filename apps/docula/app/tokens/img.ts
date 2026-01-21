import { img } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(img.key, {
    display: "ref-display-block",
    "max-width": "ref-full",
    height: "ref-auto",
    "margin-top": "ref-spacing-lg",
    "margin-bottom": "ref-spacing-lg",
  }),
];
