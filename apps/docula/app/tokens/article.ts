import { article } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(article.key, {
    background: "ref-color-transparent",
    text: "sys-on-surface",
    "line-height": "ref-leading-relaxed",
    display: "ref-display-block",
  }),
];
