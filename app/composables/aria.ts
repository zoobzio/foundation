import type { AriaBindings, AriaProps } from "#foundation/types/aria";
import type { Component } from "#foundation/types/component";

import { rekey } from "objectively";

/**
 * Maps ARIA state and properties to `aria-*` attribute bindings.
 *
 * The accessibility mirror of {@link useModifiers}: each key is a bare ARIA
 * attribute name (`pressed`, `expanded`, `label`) with a value typed from the
 * WAI-ARIA spec, emitted as the prefixed `aria-{name}`. The surface is scoped
 * to the component's ARIA role `T` — the role's supported states/properties
 * plus the global set (see `RoleAria`).
 *
 * @param props - ARIA attributes without the `aria-` prefix.
 * @returns The `aria-*` bindings, ready to spread with `v-bind`.
 */
export const useAria = <T extends Component>(
  props?: AriaProps<T>,
): AriaBindings<T> => {
  if (!props) {
    return {};
  }
  return rekey<AriaProps<T>, AriaBindings<T>>(props, (key, value) => [
    `aria-${key}`,
    value,
  ]);
};
