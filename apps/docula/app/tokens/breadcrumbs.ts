import { breadcrumbs } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(breadcrumbs.root, {}),

  createTokenDef(breadcrumbs.list, {
    display: "ref-display-flex",
    "flex-direction": "ref-flex-row",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
    "list-style-type": "ref-list-none",
  }),

  createTokenDef(breadcrumbs.item, {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-xs",
  }),

  createTokenDef(breadcrumbs.link, {
    text: "sys-on-surface-variant",
    "text-hover": "sys-primary",
    "text-active": "sys-primary-active",
    "text-focus": "sys-on-surface",
    "background-hover": "ref-color-transparent",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-bold",
    "font-weight-hover": "ref-font-bold",
    "font-weight-active": "ref-font-bold",
    "font-weight-focus": "ref-font-bold",
    "text-decoration": "ref-decoration-none",
    "text-decoration-hover": "ref-decoration-underline",
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-2xs",
    cursor: "ref-cursor-pointer",
    "box-shadow-focus": "ref-shadow-focus-ring",
  }),

  createTokenDef(breadcrumbs.current, {
    text: "sys-primary",
    "font-size": "ref-text-sm",
    "font-weight": "ref-font-bold",
    "text-decoration": "ref-decoration-none",
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    gap: "ref-spacing-2xs",
  }),

  createTokenDef(breadcrumbs.separator, {
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
  }),
];
