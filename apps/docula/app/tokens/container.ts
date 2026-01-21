import { container } from "../../elements.config";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(container.key, {
    display: "ref-display-grid",
    "grid-template-columns": "ref-layout-sidebar-right",
    "max-width": "ref-width-container",
    "margin-left": "ref-auto",
    "margin-right": "ref-auto",
  }),
];
