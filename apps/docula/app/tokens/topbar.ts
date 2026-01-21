import { topbar } from "../../elements.config";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(topbar.left, {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-md",
  }),

  createTokenDef(topbar.center, {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    width: "ref-width-xl",
  }),

  createTokenDef(topbar.right, {
    display: "ref-display-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-end",
    gap: "ref-spacing-xs",
  }),
];
