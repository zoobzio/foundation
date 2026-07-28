import type { Token } from "#foundation/types/tokens";

import components from "#config/components";
import { defineNuxtPlugin, useHead } from "#imports";
import { property } from "untheme/css";

/**
 * Attaches the component-token defaults from `config/components` to `<body>`
 * as a `<style>` tag: one rule per element that declares slots,
 * `.f-<element> { --<slot>: var(--<token>); }`.
 *
 * The middle tier of the token cascade, by document order: the theme's tokens
 * render as a `<style>` in `<head>`, these static defaults at body open, and
 * a per-instance `tokens` prop as inline `style` on the element itself
 * (`useTokens`) — the only override mechanism. Each tier wins over the one
 * before it without any specificity games.
 */
export default defineNuxtPlugin(() => {
  const rules = Object.entries(components.elements).flatMap(
    ([component, { tokens }]) => {
      const slots: [string, Token][] = Object.entries(tokens);

      if (slots.length === 0) {
        return [];
      }

      const declarations = slots
        .map(([slot, token]) => `  --${slot}: var(${property(token)});`)
        .join("\n");

      return [`.f-${component} {\n${declarations}\n}`];
    },
  );

  useHead({
    style: [{ innerHTML: rules.join("\n\n"), tagPosition: "bodyOpen" }],
  });
});
