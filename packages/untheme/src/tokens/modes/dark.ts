import type reference from "../reference/index.js";

type RefToken = keyof typeof reference;

export default {
  // Surface tokens
  "sys-surface": "ref-slate-950",
  "sys-surface-dim": "ref-slate-900",
  "sys-surface-bright": "ref-slate-800",
  "sys-surface-container": "ref-slate-900",
  "sys-surface-container-low": "ref-slate-950",
  "sys-surface-container-high": "ref-slate-800",
  "sys-surface-container-highest": "ref-slate-700",
  "sys-surface-variant": "ref-slate-900",

  // Content tokens
  "sys-on-surface": "ref-slate-100",
  "sys-on-surface-variant": "ref-slate-300",
  "sys-muted": "ref-slate-500",
  "sys-outline": "ref-slate-700",
  "sys-outline-variant": "ref-slate-800",

  // Primary
  "sys-primary": "ref-blue-500",
  "sys-primary-hover": "ref-blue-400",
  "sys-primary-active": "ref-blue-300",
  "sys-primary-container": "ref-blue-950",
  "sys-on-primary": "ref-blue-950",
  "sys-on-primary-container": "ref-blue-100",

  // Secondary
  "sys-secondary": "ref-violet-500",
  "sys-secondary-hover": "ref-violet-400",
  "sys-secondary-active": "ref-violet-300",
  "sys-secondary-container": "ref-violet-950",
  "sys-on-secondary": "ref-violet-950",
  "sys-on-secondary-container": "ref-violet-100",

  // Success
  "sys-success": "ref-green-500",
  "sys-success-hover": "ref-green-400",
  "sys-success-active": "ref-green-300",
  "sys-success-container": "ref-green-950",
  "sys-on-success": "ref-green-950",
  "sys-on-success-container": "ref-green-100",

  // Warning
  "sys-warning": "ref-amber-400",
  "sys-warning-hover": "ref-amber-300",
  "sys-warning-active": "ref-amber-200",
  "sys-warning-container": "ref-amber-950",
  "sys-on-warning": "ref-amber-950",
  "sys-on-warning-container": "ref-amber-100",

  // Error
  "sys-error": "ref-red-500",
  "sys-error-hover": "ref-red-400",
  "sys-error-active": "ref-red-300",
  "sys-error-container": "ref-red-950",
  "sys-on-error": "ref-red-950",
  "sys-on-error-container": "ref-red-100",

  // Info
  "sys-info": "ref-cyan-500",
  "sys-info-hover": "ref-cyan-400",
  "sys-info-active": "ref-cyan-300",
  "sys-info-container": "ref-cyan-950",
  "sys-on-info": "ref-cyan-950",
  "sys-on-info-container": "ref-cyan-100",

  // Interactive states
  "sys-hover": "ref-slate-800",
  "sys-pressed": "ref-slate-700",
  "sys-active": "ref-slate-700",
  "sys-active-highlight": "ref-slate-800",
  "sys-focus": "ref-blue-400",
  "sys-disabled": "ref-slate-800",
  "sys-on-disabled": "ref-slate-600",

  // Special
  "sys-scrim": "ref-slate-50",
  "sys-shadow": "ref-slate-950",
  "sys-void": "ref-black",

  // Shiki syntax highlighting
  "shiki-text": "ref-slate-100",
  "shiki-comment": "ref-green-400",
  "shiki-keyword": "ref-blue-400",
  "shiki-number": "ref-green-300",
  "shiki-string": "ref-orange-400",
  "shiki-function": "ref-amber-400",
  "shiki-type": "ref-teal-400",
  "shiki-parameter": "ref-sky-400",
  "shiki-variable": "ref-blue-300",
  "shiki-error": "ref-red-400",
  "shiki-regex": "ref-rose-400",
  "shiki-regex-constant": "ref-violet-400",
  "shiki-tag": "ref-amber-300",
  "shiki-punctuation": "ref-slate-500",
  "shiki-operator": "ref-pink-400",
  "shiki-label": "ref-slate-300",
  "shiki-header": "ref-indigo-300",
  "shiki-list-marker": "ref-blue-400",
  "shiki-builtin": "ref-cyan-400",
  "shiki-property": "ref-violet-300",
  "shiki-placeholder": "ref-cyan-300",
} satisfies Record<string, RefToken>;
