/**
 * Recasts an external interface as an object literal type, optionally
 * dropping keys.
 *
 * TypeScript grants implicit index signatures to object literal types only —
 * interfaces stay open to declaration merging and never receive one, so they
 * cannot satisfy `Record<string, unknown>` constraints. Mapping the keys
 * produces a closed, structurally identical literal copy that can. `K` names
 * keys to omit while reshaping (model props claimed by `useModel`), so the
 * one utility covers both boundary jobs. Applied wherever reka types enter
 * the foundation type space — never on `XProps`, which the SFC compiler must
 * resolve itself.
 */
export type Reshape<T, K extends keyof T = never> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};
