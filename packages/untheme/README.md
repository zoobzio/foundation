# @foundation/untheme

A token-based theming system for Nuxt applications with design system semantics, UnoCSS integration, and runtime theme switching.

## Overview

Untheme is a Nuxt module that provides a structured approach to theming through a three-tier token system:

1. **Reference Tokens** (`ref-*`) - Raw design values (colors, spacing, typography scales)
2. **Mode Tokens** (`sys-*`) - Semantic mappings that change per mode (light/dark)
3. **Role Tokens** - Component-specific tokens that reference mode or reference tokens

This architecture enables:
- Consistent design system semantics across components
- Runtime theme switching without CSS regeneration
- Type-safe token usage throughout your application
- Zero-runtime CSS generation via UnoCSS preset

## Architecture

### Token Flow

```
Reference Tokens (ref-*)
    ↓ (referenced by)
Mode Tokens (sys-*)
    ↓ (referenced by)
Role Tokens
    ↓ (applied to)
Components
```

**Example:**

```typescript
// Reference: raw value
"ref-blue-9": "#0090ff"

// Mode: semantic alias
"sys-primary": "ref-blue-9"  // in light mode
"sys-primary": "ref-blue-11" // in dark mode

// Role: component token
button: {
  background: "sys-primary"
}
```

### Template System

Roles are composed using **templates** - reusable token sets for common behaviors:

- `base` - Always included (spacing, sizing, colors, typography, etc.)
- `interactive` - Hover, active, focus states
- `disabled` - Disabled state styling
- `selected` - Selected state styling
- `animated` - Transition tokens
- `flexbox` - Flex container properties
- `grid` - Grid container properties
- `positioned` - Position/transform properties
- `overflow` - Overflow handling
- `transform` - CSS transforms

**Example:**

```typescript
// src/roles/button.ts
import { createBaseTokens } from "#untheme/utils";

export default createBaseTokens("interactive", "animated");
```

This creates a button role with base + interactive + animated tokens.

## File Structure

```
packages/untheme/
├── src/                          # Core package source
│   ├── config.ts                 # Type definitions & config helper
│   ├── defaults.ts               # Default theme (aggregates reference/modes/roles)
│   ├── module.ts                 # Nuxt module definition
│   ├── preset.ts                 # UnoCSS preset for CSS generation
│   ├── types.ts                  # Template & token type utilities
│   ├── utils.ts                  # Template composition helper
│   │
│   ├── reference/                # Reference tokens (ref-*)
│   │   ├── index.ts              # Barrel export
│   │   ├── color.ts              # Color scales (Radix-based)
│   │   ├── spacing.ts            # Spacing scale
│   │   ├── typography.ts         # Font families, sizes, weights
│   │   ├── shadow.ts             # Box shadow values
│   │   ├── animation.ts          # Transition durations
│   │   ├── schema.ts             # Property-to-token mappings
│   │   └── ...                   # Other reference categories
│   │
│   ├── modes/                    # Mode tokens (sys-*)
│   │   ├── index.ts              # Barrel export
│   │   ├── light.ts              # Light mode semantic tokens
│   │   └── dark.ts               # Dark mode semantic tokens
│   │
│   ├── roles/                    # Role definitions
│   │   ├── index.ts              # Barrel export
│   │   ├── button.ts             # Button role
│   │   ├── a.ts                  # Link role
│   │   ├── h1.ts                 # Heading roles
│   │   └── ...                   # Other component roles
│   │
│   └── templates/                # Reusable token templates
│       ├── index.ts              # Barrel export
│       ├── base.ts               # Base tokens (always included)
│       ├── interactive.ts        # Interactive state tokens
│       ├── animated.ts           # Animation tokens
│       └── ...                   # Other templates
│
├── runtime/                      # Nuxt runtime code (auto-imported)
│   ├── composables/
│   │   └── untheme.ts           # useUntheme(), useTokenStyle()
│   ├── plugins/
│   │   └── untheme.ts           # CSS variable injection plugin
│   ├── stores/
│   │   └── untheme.ts           # Pinia store for theme state
│   └── utils/
│       └── untheme.ts           # Runtime utilities
│
├── themes/                       # User-defined themes
│   └── vanilla.ts               # Example theme
│
├── package.json                  # Package exports & imports config
└── tsconfig.json                # TypeScript config with path mappings
```

## Import Patterns

### Internal Imports (within package)

Use `#untheme/*` subpath imports to avoid relative paths:

```typescript
// ✅ Good - uses subpath import
import { createBaseTokens } from "#untheme/utils";
import defaults from "#untheme/defaults";
import modes from "#untheme/modes";

// ❌ Bad - relative import
import { createBaseTokens } from "../../utils";
```

**Available subpaths:**
- `#untheme/*` → `./src/*`
- `#runtime/*` → `./runtime/*`
- `#themes/*` → `./themes/*`

### External Imports (consuming apps)

Use `@foundation/untheme/*` package exports:

```typescript
import theme from "@foundation/untheme";              // Default theme
import { defineUntheme } from "@foundation/untheme/config";
import preset from "@foundation/untheme/preset";
import vanilla from "@foundation/untheme/themes/vanilla";
```

**Available exports:**
- `@foundation/untheme` → Default theme
- `@foundation/untheme/defaults` → Default theme (explicit)
- `@foundation/untheme/config` → Type definitions & helpers
- `@foundation/untheme/preset` → UnoCSS preset
- `@foundation/untheme/module` → Nuxt module
- `@foundation/untheme/themes/*` → Theme files

### Auto-Imported (in Nuxt apps)

When the module is installed, these are auto-imported:

**Composables:**
- `useUntheme()` - Access theme state and utilities
- `useTokenStyle()` - Generate CSS variables from tokens

**Stores:**
- `accessUnthemeStore()` - Direct store access

**Types:**
- `RefToken`, `ModeToken`, `RoleToken`, `Token`
- `Untheme`, `UnthemeConfig`, `Tokens`

## How to Make Changes

### Adding a New Reference Token

1. **Find the appropriate category** in `src/reference/`:

```typescript
// src/reference/color.ts
export default {
  "ref-purple-9": "#8e4ec6",  // Add your token
  // ...
};
```

2. **Update the schema** if adding a new CSS property:

```typescript
// src/reference/schema.ts
export type PropertyTokenMap = {
  background: ColorToken;
  "new-property": RefToken;  // Add property mapping
};
```

### Adding a New Mode Token

Update both mode files to maintain light/dark parity:

```typescript
// src/modes/light.ts
export default {
  "sys-new-semantic": "ref-gray-9",
};

// src/modes/dark.ts
export default {
  "sys-new-semantic": "ref-gray-3",  // Different reference
};
```

### Adding a New Role

1. **Create the role file** in `src/roles/`:

```typescript
// src/roles/card.ts
import { createBaseTokens } from "#untheme/utils";

export default createBaseTokens("interactive");
```

2. **Export it** from `src/roles/index.ts`:

```typescript
import card from "./card";

export default {
  // ...
  card,
};
```

3. **Use it** in UnoCSS:

```vue
<div class="f-card">...</div>
```

### Adding a New Template

1. **Create the template** in `src/templates/`:

```typescript
// src/templates/elevated.ts
import type reference from "#untheme/reference";
import type modes from "#untheme/modes";

type RefToken = keyof typeof reference | keyof typeof modes.light;

export default {
  "box-shadow": "ref-ignore" as RefToken,
  "z-index": "ref-ignore" as RefToken,
};
```

2. **Export it** from `src/templates/index.ts`:

```typescript
import elevated from "./elevated";

export default {
  // ...
  elevated,
};
```

3. **Use it in roles**:

```typescript
// src/roles/dialog.ts
import { createBaseTokens } from "#untheme/utils";

export default createBaseTokens("elevated", "interactive");
```

### Creating a Custom Theme

Themes are partial configurations that override the defaults. The `themes/vanilla.ts` file serves as the reference example.

#### Understanding Theme Merging

Themes are **merged** with defaults using `defu()`:

```typescript
// In the Nuxt module
const tokens = defu(options, theme);  // User theme merged with defaults
```

This means you only need to specify tokens you want to **change**. Unspecified tokens use their default values.

#### Theme File Pattern

1. **Create a theme file** in `themes/` (following the `vanilla.ts` pattern):

```typescript
// themes/custom.ts
import { defineUntheme } from "../src/config";

export default defineUntheme({
  // Optional: Override reference tokens (design system primitives)
  reference: {
    "ref-spacing-xl": "2rem",
    "ref-blue-9": "#0066cc",
  },

  // Optional: Override mode tokens (semantic mappings)
  modes: {
    light: {
      "sys-primary": "ref-blue-10",
      "sys-surface": "ref-gray-1",
    },
    dark: {
      "sys-primary": "ref-blue-9",
      "sys-surface": "ref-gray-12",
    },
  },

  // Optional: Override role tokens (component styling)
  roles: {
    button: {
      background: "sys-primary",
      "padding-top": "ref-spacing-xl",
    },
    h1: {
      "font-size": "ref-text-5xl",
      "font-weight": "ref-font-black",
    },
  },
});
```

2. **Export it** from `package.json` (already configured):

```json
{
  "exports": {
    "./themes/*": "./themes/*.ts"
  }
}
```

3. **Use it in your Nuxt app**:

```typescript
// nuxt.config.ts
import custom from "@foundation/untheme/themes/custom";

export default defineNuxtConfig({
  modules: ["@foundation/untheme/module"],
  untheme: custom,
});
```

#### Using the Vanilla Theme

The included `vanilla.ts` theme demonstrates the pattern:

```typescript
// Import and use directly
import vanilla from "@foundation/untheme/themes/vanilla";

export default defineNuxtConfig({
  modules: ["@foundation/untheme/module"],
  untheme: vanilla,
});
```

**What's in vanilla.ts?**

Vanilla provides opinionated defaults for all roles:
- Semantic color mappings (`sys-primary`, `sys-surface`, etc.)
- Typography hierarchy for headings, paragraphs, links
- Interactive component styling (buttons, links, tabs, etc.)
- Accessible focus states and transitions

**When to use vanilla:**
- Starting a new project with sensible defaults
- As a reference for creating your own theme
- Quick prototyping without custom styling

**When to create a custom theme:**
- Brand-specific design system
- Different spacing/typography scale
- Custom component behaviors

### Modifying the UnoCSS Preset

The preset generates CSS classes from roles:

```typescript
// src/preset.ts - Key functions to modify:

// generateBaseCSS() - Base component styles
// generateStateCSS() - :hover, :active, :focus, etc.
// getRoleFeatures() - Detects which states a role uses
```

**Generated CSS example:**

```css
.f-button {
  background: var(--button-background);
  color: var(--button-text);
  /* ... */
}

.f-button:hover {
  background: var(--button-background-hover);
}
```

## Development Workflow

### Type Checking

```bash
pnpm typecheck
```

This checks all TypeScript files including `runtime/` using Nuxt types.

### Local Development

```bash
# In the package
pnpm link --global

# In your Nuxt app
pnpm link --global @foundation/untheme
```

### Testing Changes

Since this is a Nuxt module, test in a consuming Nuxt application:

1. Make changes in `packages/untheme/`
2. Nuxt will hot-reload the module
3. Verify in browser DevTools that CSS variables update

### Adding Dependencies

- **Production deps** → Used at runtime in Nuxt apps
- **Dev deps** → Used only during development/build

```bash
pnpm add <package>       # Production
pnpm add -D <package>    # Development
```

## Token Resolution

Tokens are resolved at runtime in this order:

1. **Direct values** - Literal CSS values (e.g., `"#ff0000"`, `"1rem"`)
2. **Reference tokens** - `ref-*` tokens from reference layer
3. **Mode tokens** - `sys-*` tokens from current mode (light/dark)
4. **Role tokens** - Component-specific tokens (resolved recursively)
5. **Ignore marker** - `ref-ignore` means "not set" (no CSS variable output)

### Example Resolution

```typescript
// Given this token chain:
button: {
  background: "sys-primary"  // → resolves to sys-primary
}

modes.light: {
  "sys-primary": "ref-blue-9"  // → resolves to ref-blue-9
}

reference: {
  "ref-blue-9": "#0090ff"  // → final value
}

// Result: --button-background: #0090ff;
```

## Best Practices

### For Developers

1. **Use semantic tokens** - Prefer `sys-*` over `ref-*` in roles
2. **Compose templates** - Don't duplicate tokens across roles
3. **Type safety** - Let TypeScript guide valid token references
4. **Consistent naming** - Follow existing conventions (`ref-`, `sys-`)

### For LLM Agents

When modifying this package:

1. **Respect token hierarchy** - Reference → Mode → Role
2. **Update both modes** - Light and dark should be kept in sync
3. **Check types** - Run `pnpm typecheck` after changes
4. **Use internal imports** - Always use `#untheme/*` within the package
5. **Update barrels** - Export new files from `index.ts` in each directory
6. **Maintain templates** - Keep template tokens generic and reusable
7. **Document patterns** - Update this README when adding new patterns

### Common Pitfalls

- **Don't use relative imports** internally - Use `#untheme/*`
- **Don't skip mode parity** - Both light/dark need the same `sys-*` tokens
- **Don't hardcode values in roles** - Use reference or mode tokens
- **Don't forget barrel exports** - New files must be exported from `index.ts`

## Runtime API

### useUntheme()

Access theme state and utilities:

```typescript
const { mode, theme, tokens, setMode, setTheme, resolve } = useUntheme();

// Switch between light/dark
setMode("dark");

// Resolve a token to its final value
const color = resolve("sys-primary"); // "#0090ff"
```

### useTokenStyle()

Generate CSS variables for custom components:

```typescript
const style = useTokenStyle({
  card: {
    background: "sys-surface",
    "border-color": "sys-border",
  },
});

// Returns computed ref with:
// { card: { "--card-background": "#fff", "--card-border-color": "#e0e0e0" } }
```

## UnoCSS Integration

The preset generates utility classes prefixed with `f-`:

```html
<!-- Role-based styling -->
<button class="f-button">Click me</button>
<a href="#" class="f-a">Link</a>
<h1 class="f-h1">Title</h1>
```

States are handled automatically via pseudo-classes:

```css
/* Generated by the preset */
.f-button:hover { ... }
.f-button:active { ... }
.f-button:disabled { ... }
.f-button[aria-selected="true"] { ... }
```

## Type System

All tokens are fully typed:

```typescript
import type { RefToken, ModeToken, RoleToken, Token } from "@foundation/untheme/config";

// Autocomplete and validation
const ref: RefToken = "ref-blue-9";      // ✅
const sys: ModeToken = "sys-primary";    // ✅
const role: RoleToken = "button-background"; // ✅
const any: Token = "sys-primary";        // ✅

const invalid: RefToken = "nonsense";    // ❌ Type error
```

## License

MIT
