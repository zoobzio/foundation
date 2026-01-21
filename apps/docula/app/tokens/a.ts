import { a } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(a.key, {
    text: "sys-primary",
    "text-hover": "sys-primary",
    "text-active": "sys-primary-active",
    "text-focus": "sys-primary",
    "text-disabled": "sys-on-surface",
    "background-hover": "ref-color-transparent",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-bold",
    "font-weight-hover": "ref-font-bold",
    "font-weight-active": "ref-font-bold",
    "font-weight-focus": "ref-font-bold",
    "line-height": "ref-leading-normal",
    "text-decoration": "ref-decoration-none",
    "text-decoration-hover": "ref-decoration-underline",
    cursor: "ref-cursor-pointer",
    "cursor-disabled": "ref-cursor-default",
    "box-shadow-focus": "ref-shadow-focus-ring",
  }),
];
