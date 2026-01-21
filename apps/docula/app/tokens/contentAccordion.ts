import { contentAccordion } from "@foundation/prose/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(contentAccordion.key, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-col",
    gap: "ref-spacing-md",
    "padding-left": "ref-spacing-md",
    "border-left-width": "ref-border-width-thin",
    "border-left-style": "ref-border-style-solid",
    "border-color": "sys-outline",
  }),
];
