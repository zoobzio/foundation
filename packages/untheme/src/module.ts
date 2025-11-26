import type { UnthemeOptions } from "./config";

import { generateAllElementsCSS } from "./css";
import reference from "./tokens/reference";
import modes from "./tokens/modes";

/**
 * Merge token objects with null-preservation semantics.
 * First defined value wins (including null). Unlike defu, null values
 * are treated as real values and not overridden by later sources.
 */
function mergeTokens(
  ...sources: Record<string, string | null>[]
): Record<string, string | null> {
  const result: Record<string, string | null> = {};
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      if (!(key in result)) {
        result[key] = value;
      }
    }
  }
  return result;
}

import {
  defineNuxtModule,
  addTemplate,
  addImports,
  addPlugin,
  createResolver,
} from "@nuxt/kit";

// Generate TypeScript declarations for element registry
function generateElementRegistry(
  elements: Record<
    string,
    {
      defaults: Record<string, Record<string, string | null>>;
      tokens: Record<string, string | null>;
    }
  >,
): string {
  const entries = Object.entries(elements).map(([name, elementConfig]) => {
    // Extract role names from defaults (excluding "base")
    const roles = Object.keys(elementConfig.defaults).filter(
      (r) => r !== "base",
    );

    // Generate type for this element
    const rolesArray =
      roles.length > 0 ? `[${roles.map((r) => `"${r}"`).join(", ")}]` : "[]";
    return `    "${name}": Partial<ElementTokens<${rolesArray}>>;`;
  });

  return `import type { ElementTokens } from '@foundation/untheme/config';
  export interface ElementRegistry {
${entries.join("\n")}
  }
`;
}

export default defineNuxtModule<UnthemeOptions>({
  meta: {
    name: "untheme",
    configKey: "untheme",
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    // Use provided theme or default to base system tokens
    const theme = options.theme || { reference, modes };

    // Merge elements: role tokens + user overrides (Nuxt auto-merged from all layers)
    const mergedElements: Record<string, Record<string, string | null>> = {};

    for (const [elementName, elementConfig] of Object.entries(
      options.elements || {},
    )) {
      // elementConfig contains { defaults: { base: {...}, role1: {...}, ... }, tokens: {...} }
      // Merge user tokens with role defaults (user tokens take priority)
      const roleDefaults = Object.values(elementConfig.defaults);
      mergedElements[elementName] = mergeTokens(
        elementConfig.tokens,
        ...roleDefaults,
      );
    }

    // Generate CSS from merged elements
    const css = generateAllElementsCSS(mergedElements);

    // Add CSS template
    const cssTemplate = addTemplate({
      filename: "untheme.css",
      getContents: () => css,
      write: true,
    });

    // Inject into Nuxt CSS
    nuxt.options.css.push(cssTemplate.dst);

    // Generate TypeScript declarations for element registry
    addTemplate({
      filename: "types/untheme.d.ts",
      getContents: () => generateElementRegistry(options.elements || {}),
      write: true,
    });

    // Add runtime config template
    addTemplate({
      filename: "untheme.config.mjs",
      getContents: () =>
        `export default ${JSON.stringify({ elements: mergedElements, theme }, null, 2)};`,
      write: true,
    });

    // Register plugin
    addPlugin(resolver.resolve("../runtime/plugin"));

    // Auto-import composables and utilities
    addImports([
      { name: "tokenize", from: resolver.resolve("../runtime/utils") },
      { name: "keys", from: resolver.resolve("../runtime/utils") },
      { name: "useUntheme", from: resolver.resolve("../runtime/composables") },
      {
        name: "useTokenStyle",
        from: resolver.resolve("../runtime/composables"),
      },
      {
        name: "Tokens",
        from: resolver.resolve("../runtime/types"),
        type: true,
      },
    ]);
  },
});
