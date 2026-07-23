import type { Component } from "#foundation/types/component";
import type {
  ModifierBindings,
  ModifierProps,
} from "#foundation/types/modifiers";

import { rekey } from "objectively";

/**
 * Maps a component's modifier axes to `data-*` attribute bindings.
 *
 * Each axis becomes a `data-{axis}` attribute carrying its selected option, so
 * a recipe can target `[data-variant="solid"]` in CSS. The valid axes and
 * options come from the generated `ComponentModifiers` contract for component
 * `T`.
 *
 * @param props - The selected option per axis (e.g. `{ variant: "solid" }`).
 *   Omitted or `undefined` binds nothing.
 * @returns The `data-*` bindings, ready to spread with `v-bind`.
 */
export const useModifiers = <T extends Component>(
  props?: ModifierProps<T>,
): ModifierBindings<T> => {
  if (!props) {
    return {};
  }
  return rekey<ModifierProps<T>, ModifierBindings<T>>(props, (key, value) => [
    `data-${key}`,
    value,
  ]);
};
