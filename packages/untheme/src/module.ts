import type { UnthemeOptions, ElementDefinition } from "./config";

import { generateElementCSS } from "./css";
import reference from "./tokens/reference";
import modes from "./tokens/modes";
import defu from "defu";

import {
  defineNuxtModule,
  addTemplate,
  addImports,
  addPlugin,
  createResolver,
} from "@nuxt/kit";

// Generate TypeScript declarations for element registry
function generateElementRegistry(
  elements: Record<string, ElementDefinition>,
): string {
  const entries = Object.entries(elements).map(([name, elementConfig]) => {
    const rolesArray =
      elementConfig.roles.length > 0
        ? `[${elementConfig.roles.map((r) => `"${r}"`).join(", ")}]`
        : "[]";
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

    // Merge provided theme with defaults
    const theme = defu(options.theme || {}, { reference, modes });

    // Elements are now directly serializable { roles, keys }
    const elements = options.elements || {};

    // Generate global reset CSS
    const resetCSS = `* {
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  vertical-align: baseline;
  box-sizing: border-box;
}`;

    // Add global reset CSS
    const resetTemplate = addTemplate({
      filename: "untheme.reset.css",
      getContents: () => resetCSS,
      write: true,
    });

    // Inject reset CSS globally
    nuxt.options.css.push(resetTemplate.dst);

    // Generate CSS custom properties for tokens
    const generateTokenCSS = () => {
      const lines: string[] = [];

      // Helper to check if a value is a token reference
      const isTokenReference = (value: string): boolean => {
        return value.startsWith('ref-') || value.startsWith('sys-') || value.startsWith('shiki-');
      };

      // Helper to wrap token references in var()
      const wrapValue = (value: string): string => {
        if (isTokenReference(value)) {
          return `var(--${value})`;
        }
        return value;
      };

      // Reference tokens (hard values)
      if (theme.reference) {
        lines.push(':root {');
        Object.entries(theme.reference).forEach(([key, value]) => {
          if (value !== null) {
            lines.push(`  --${key}: ${value};`);
          }
        });
        lines.push('}');
      }

      // Light mode tokens (may reference ref- tokens)
      if (theme.modes?.light) {
        lines.push('\n:root {');
        Object.entries(theme.modes.light).forEach(([key, value]) => {
          if (value !== null) {
            lines.push(`  --${key}: ${wrapValue(value)};`);
          }
        });
        lines.push('}');
      }

      // Dark mode tokens (may reference ref- tokens)
      if (theme.modes?.dark) {
        lines.push('\n.dark {');
        Object.entries(theme.modes.dark).forEach(([key, value]) => {
          if (value !== null) {
            lines.push(`  --${key}: ${wrapValue(value)};`);
          }
        });
        lines.push('}');
      }

      return lines.join('\n');
    };

    // Add tokens CSS
    const tokensTemplate = addTemplate({
      filename: "untheme.tokens.css",
      getContents: generateTokenCSS,
      write: true,
    });
    nuxt.options.css.push(tokensTemplate.dst);

    // Generate individual CSS files per element (with unresolved var() references)
    for (const [elementName, elementConfig] of Object.entries(elements)) {
      // Create token map with null values - CSS generator will create var() references
      const tokenMap: Record<string, string | null> = {};
      for (const key of elementConfig.keys) {
        tokenMap[key] = null; // Actual values come from runtime defineTokens()
      }
      const elementCSS = generateElementCSS(elementName, tokenMap);

      addTemplate({
        filename: `untheme/${elementName}.css`,
        getContents: () => elementCSS,
        write: true,
      });
    }

    // Generate TypeScript declarations for element registry
    addTemplate({
      filename: "types/untheme.d.ts",
      getContents: () => generateElementRegistry(elements),
      write: true,
    });

    // Runtime config is now the elements directly (already has keys and roles)
    const runtimeConfig: Record<string, { keys: string[]; roles: string[] }> = {};
    Object.entries(elements).forEach(([elementName, elementConfig]) => {
      runtimeConfig[elementName] = {
        keys: elementConfig.keys,
        roles: elementConfig.roles,
      };
    });

    addTemplate({
      filename: "untheme.config.mjs",
      getContents: () => `export default ${JSON.stringify(runtimeConfig, null, 2)};`,
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
        name: "defineTokens",
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
