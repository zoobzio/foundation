import { avatar } from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

export default [
  createTokenDef(avatar.root, {
    width: "ref-spacing-2xl",
    height: "ref-spacing-2xl",
    "border-top-left-radius": "ref-radius-full",
    "border-top-right-radius": "ref-radius-full",
    "border-bottom-right-radius": "ref-radius-full",
    "border-bottom-left-radius": "ref-radius-full",
    "overflow-x": "ref-overflow-hidden",
    "overflow-y": "ref-overflow-hidden",
    display: "ref-display-inline-flex",
  }),

  createTokenDef(avatar.image, {
    width: "ref-full",
    height: "ref-full",
    "object-fit": "ref-object-cover",
    display: "ref-display-block",
  }),

  createTokenDef(avatar.fallback, {
    width: "ref-full",
    height: "ref-full",
    background: "sys-surface-container",
    text: "sys-on-surface",
    display: "ref-display-inline-flex",
    "align-items": "ref-align-center",
    "justify-content": "ref-justify-center",
    "font-size": "ref-text-base",
    "font-weight": "ref-font-medium",
  }),
];
