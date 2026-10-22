import { keys } from "objectively";

/**
 * Seeds a fresh state container: each defined field of `initial` replaces
 * the container's default in place; an undefined field leaves the default.
 * Returns the container it was given. `S` comes from the container alone,
 * so a partial slice never narrows it.
 */
export const seed = <S extends object>(
  state: S,
  initial: NoInfer<Partial<S>> = {},
): S => {
  for (const key of keys(initial)) {
    const value = initial[key];
    if (value === undefined) continue;
    state[key] = value;
  }
  return state;
};
