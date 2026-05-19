import type { Theme } from "./config";
import type { CustomColor } from "./types";

export const isTokenReference = (value: string): boolean =>
  value.startsWith("ref-") ||
  value.startsWith("sys-") ||
  value.startsWith("shiki-") ||
  value.startsWith("clr-") ||
  value.startsWith("role-");

export const wrapValue = (value: string): string =>
  isTokenReference(value) ? `var(--${value})` : value;

export const generateThemeCSS = (
  theme: Theme,
  colors?: Record<string, CustomColor>,
  roles?: Record<string, string>,
): string => {
  const lines: string[] = [];

  // Reference tokens (hard values)
  if (theme.reference) {
    lines.push(":root {");
    Object.entries(theme.reference).forEach(([key, value]) => {
      if (value !== null) {
        lines.push(`  --${key}: ${value};`);
      }
    });
    lines.push("}");
  }

  // Light mode tokens (may reference ref- tokens)
  if (theme.modes?.light) {
    lines.push("\n:root {");
    Object.entries(theme.modes.light).forEach(([key, value]) => {
      if (value !== null) {
        lines.push(`  --${key}: ${wrapValue(value)};`);
      }
    });
    if (colors) {
      for (const [name, color] of Object.entries(colors)) {
        lines.push(`  --clr-${name}: var(--ref-${color.family}-${color.light});`);
      }
    }
    lines.push("}");
  }

  // Dark mode tokens (may reference ref- tokens)
  if (theme.modes?.dark) {
    lines.push("\n.dark {");
    Object.entries(theme.modes.dark).forEach(([key, value]) => {
      if (value !== null) {
        lines.push(`  --${key}: ${wrapValue(value)};`);
      }
    });
    if (colors) {
      for (const [name, color] of Object.entries(colors)) {
        lines.push(`  --clr-${name}: var(--ref-${color.family}-${color.dark});`);
      }
    }
    lines.push("}");
  }

  // Role tokens (mode-independent, reference any token)
  if (roles && Object.keys(roles).length > 0) {
    lines.push("\n:root {");
    for (const [name, value] of Object.entries(roles)) {
      lines.push(`  --role-${name}: ${wrapValue(value)};`);
    }
    lines.push("}");
  }

  return lines.join("\n");
};
