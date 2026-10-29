const kebab = (key: string): string =>
  key.replace(/([A-Z])/g, "-$1").toLowerCase();

/**
 * Whether the consumer passed a prop, by its camel or kebab name on the
 * vnode. An explicit `undefined` counts as passed.
 */
export const isExplicit = (key: string, vnodeProps: object | null): boolean =>
  !!vnodeProps && (key in vnodeProps || kebab(key) in vnodeProps);
