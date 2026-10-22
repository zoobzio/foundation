export const pascal = (kebab: string): string =>
  kebab.replace(/(^|-)([a-z])/g, (_, __, c: string) => c.toUpperCase());
