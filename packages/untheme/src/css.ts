import type { Theme } from "./config";

export const isTokenReference = (value: string): boolean =>
  value.startsWith("ref-") ||
  value.startsWith("sys-") ||
  value.startsWith("shiki-");

export const wrapValue = (value: string): string =>
  isTokenReference(value) ? `var(--${value})` : value;

export const generateThemeCSS = (theme: Theme): string => {
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
    lines.push("}");
  }

  return lines.join("\n");
};
