---
"@zoobzio/foundation": patch
---

Remove the theming, binding, and MCP subsystems from the layer. The `@untheme/nuxt` module, its `config/untheme` theme definition, and the `tokens` plugin are no longer registered or shipped, so the layer no longer provides a theme or component-token defaults. The component registry (`config/components`), the modifier schema (`config/modifiers`), and everything they powered are gone: the `useBindings`, `useAria`, `useModifiers`, and `useTokens` composables, and the `aria`, `aria-spec`, `bindings`, `component`, `element`, `modifiers`, `token`, and `tokens` type modules. The `aria-query`, `untheme`, `@untheme/*`, `icon-sheets`, and `@iconify-json/*` dependencies are dropped.

The toast variant is now a plain `ToastVariant` union exported from `types/core/toast`, replacing the modifier-derived type on `ToastProps`, `Notification`, and `severityToVariant`.

The `@zoobzio/foundation-mcp` package is removed from the repository and is no longer versioned alongside the layer.
