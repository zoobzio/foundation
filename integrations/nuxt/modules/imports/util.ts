export const pascal = (kebab: string): string =>
  kebab.replace(/(^|-)([a-z])/g, (_, __, c: string) => c.toUpperCase());

/**
 * Whether a component name is in the wrapped set. A guard, so the readonly
 * tuple's `includes` takes the wider name.
 */
export const wrapped = <W extends string>(
  name: string,
  set: readonly W[],
): name is W => set.some((entry) => entry === name);
