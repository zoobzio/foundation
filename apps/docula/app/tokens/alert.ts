import {
  alertNote,
  alertNoteIcon,
  alertTip,
  alertTipIcon,
  alertImportant,
  alertImportantIcon,
  alertWarning,
  alertWarningIcon,
  alertCaution,
  alertCautionIcon,
} from "@foundation/blocks/elements";
import { createTokenDef } from "./helpers";

const alertBase = {
  display: "ref-display-flex",
  "flex-direction": "ref-flex-row",
  "align-items": "ref-align-center",
  gap: "ref-spacing-sm",
  "padding-left": "ref-spacing-md",
  "padding-right": "ref-spacing-md",
  "margin-top": "ref-spacing-lg",
  "margin-bottom": "ref-spacing-lg",
  "border-top-width": "ref-hairline",
  "border-right-width": "ref-hairline",
  "border-bottom-width": "ref-hairline",
  "border-left-width": "ref-border-width-heavy",
  "border-top-style": "ref-border-style-solid",
  "border-right-style": "ref-border-style-solid",
  "border-bottom-style": "ref-border-style-solid",
  "border-left-style": "ref-border-style-solid",
} as const;

const alertIconBase = {
  display: "ref-display-flex",
  "align-items": "ref-align-center",
  "font-size": "ref-text-2xl",
} as const;

export default [
  createTokenDef(alertNote.key, {
    ...alertBase,
    background: "sys-info-container",
    text: "sys-on-surface",
    "border-color": "sys-info",
  }),

  createTokenDef(alertNoteIcon.key, {
    ...alertIconBase,
    text: "sys-info",
  }),

  createTokenDef(alertTip.key, {
    ...alertBase,
    background: "sys-secondary-container",
    text: "sys-on-surface",
    "border-color": "sys-secondary",
  }),

  createTokenDef(alertTipIcon.key, {
    ...alertIconBase,
    text: "sys-secondary",
  }),

  createTokenDef(alertImportant.key, {
    ...alertBase,
    background: "sys-primary-container",
    text: "sys-on-surface",
    "border-color": "sys-primary",
  }),

  createTokenDef(alertImportantIcon.key, {
    ...alertIconBase,
    text: "sys-primary",
  }),

  createTokenDef(alertWarning.key, {
    ...alertBase,
    background: "sys-warning-container",
    text: "sys-on-surface",
    "border-color": "sys-warning",
  }),

  createTokenDef(alertWarningIcon.key, {
    ...alertIconBase,
    text: "sys-warning",
  }),

  createTokenDef(alertCaution.key, {
    ...alertBase,
    background: "sys-error-container",
    text: "sys-on-surface",
    "border-color": "sys-error",
  }),

  createTokenDef(alertCautionIcon.key, {
    ...alertIconBase,
    text: "sys-error",
  }),
];
