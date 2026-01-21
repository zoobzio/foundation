import type reference from "../reference/index.js";

type RefToken = keyof typeof reference;

export default {
  // Surface tokens
  "sys-surface": "ref-slate-50",
  "sys-surface-dim": "ref-slate-100",
  "sys-surface-bright": "ref-slate-50",
  "sys-surface-container": "ref-slate-100",
  "sys-surface-container-low": "ref-slate-50",
  "sys-surface-container-high": "ref-slate-200",
  "sys-surface-container-highest": "ref-slate-300",
  "sys-surface-variant": "ref-slate-100",

  // Content tokens
  "sys-on-surface": "ref-slate-900",
  "sys-on-surface-variant": "ref-slate-700",
  "sys-muted": "ref-slate-500",
  "sys-outline": "ref-slate-300",
  "sys-outline-variant": "ref-slate-200",

  // Primary
  "sys-primary": "ref-blue-600",
  "sys-primary-hover": "ref-blue-700",
  "sys-primary-active": "ref-blue-800",
  "sys-primary-container": "ref-blue-100",
  "sys-on-primary": "ref-blue-50",
  "sys-on-primary-container": "ref-blue-950",

  // Secondary
  "sys-secondary": "ref-violet-600",
  "sys-secondary-hover": "ref-violet-700",
  "sys-secondary-active": "ref-violet-800",
  "sys-secondary-container": "ref-violet-100",
  "sys-on-secondary": "ref-violet-50",
  "sys-on-secondary-container": "ref-violet-950",

  // Success
  "sys-success": "ref-green-600",
  "sys-success-hover": "ref-green-700",
  "sys-success-active": "ref-green-800",
  "sys-success-container": "ref-green-100",
  "sys-on-success": "ref-green-50",
  "sys-on-success-container": "ref-green-950",

  // Warning
  "sys-warning": "ref-amber-500",
  "sys-warning-hover": "ref-amber-600",
  "sys-warning-active": "ref-amber-700",
  "sys-warning-container": "ref-amber-100",
  "sys-on-warning": "ref-amber-950",
  "sys-on-warning-container": "ref-amber-950",

  // Error
  "sys-error": "ref-red-600",
  "sys-error-hover": "ref-red-700",
  "sys-error-active": "ref-red-800",
  "sys-error-container": "ref-red-100",
  "sys-on-error": "ref-red-50",
  "sys-on-error-container": "ref-red-950",

  // Info
  "sys-info": "ref-cyan-600",
  "sys-info-hover": "ref-cyan-700",
  "sys-info-active": "ref-cyan-800",
  "sys-info-container": "ref-cyan-100",
  "sys-on-info": "ref-cyan-50",
  "sys-on-info-container": "ref-cyan-950",

  // Interactive states
  "sys-hover": "ref-slate-100",
  "sys-pressed": "ref-slate-200",
  "sys-active": "ref-slate-200",
  "sys-active-highlight": "ref-slate-100",
  "sys-focus": "ref-blue-500",
  "sys-disabled": "ref-slate-200",
  "sys-on-disabled": "ref-slate-400",

  // Special
  "sys-scrim": "ref-slate-950",
  "sys-shadow": "ref-slate-950",
  "sys-void": "ref-white",

  // Shiki syntax highlighting
  "shiki-text": "ref-slate-900",
  "shiki-comment": "ref-green-600",
  "shiki-keyword": "ref-blue-600",
  "shiki-number": "ref-green-500",
  "shiki-string": "ref-orange-600",
  "shiki-function": "ref-amber-600",
  "shiki-type": "ref-teal-600",
  "shiki-parameter": "ref-sky-600",
  "shiki-variable": "ref-blue-500",
  "shiki-error": "ref-red-600",
  "shiki-regex": "ref-rose-600",
  "shiki-regex-constant": "ref-violet-500",
  "shiki-tag": "ref-amber-700",
  "shiki-punctuation": "ref-slate-400",
  "shiki-operator": "ref-pink-600",
  "shiki-label": "ref-slate-600",
  "shiki-header": "ref-indigo-400",
  "shiki-list-marker": "ref-blue-500",
  "shiki-builtin": "ref-cyan-600",
  "shiki-property": "ref-violet-600",
  "shiki-placeholder": "ref-cyan-500",
} satisfies Record<string, RefToken>;
