import { keys, rekey } from "objectively";

const kebab = (key: string): string =>
  key.replace(/([A-Z])/g, "-$1").toLowerCase();

/**
 * Whether the consumer passed a prop, by its camel or kebab name on the
 * vnode. An explicit `undefined` counts as passed.
 */
export const isExplicit = (key: string, vnodeProps: object | null): boolean =>
  !!vnodeProps && (key in vnodeProps || kebab(key) in vnodeProps);

/**
 * The props the consumer passed, projected from the resolved props. An
 * absent prop stays absent, so a boolean is not cast to `false` and a
 * model keeps its uncontrolled default; an explicit `undefined` still
 * passes. The required props are always present, so the result keeps the
 * props type.
 */
export const explicit = <P extends object>(
  props: P,
  vnodeProps: object | null,
): P => {
  const out: Record<string, unknown> = {};
  for (const key of keys(props)) {
    if (isExplicit(key, vnodeProps)) out[key] = props[key];
  }
  return rekey<Record<string, unknown>, P>(out, (key, value) => [key, value]);
};
