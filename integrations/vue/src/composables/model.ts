import type { WritableComputedRef } from "vue";

import { computed, getCurrentInstance, shallowRef } from "vue";
import { isExplicit } from "../utils/explicit";

/**
 * A writable model that falls back to local state when the prop is absent.
 * With a `default` and no `explicit`, the value is never `undefined`.
 *
 * @param prop - A getter for the model prop.
 * @param emit - Emits the `update:*` event.
 * @param options.default - The initial local value.
 * @param options.explicit - The prop name. When set, presence of the prop on
 * the vnode decides control, so an explicit `undefined` is a controlled value.
 */
export function useModel<T>(
  prop: () => T | undefined,
  emit: (value: T) => void,
  options: { default: T; explicit?: undefined },
): WritableComputedRef<T, T>;
export function useModel<T>(
  prop: () => T | undefined,
  emit: (value: T) => void,
  options?: { default?: T; explicit?: string },
): WritableComputedRef<T | undefined, T>;
export function useModel<T>(
  prop: () => T | undefined,
  emit: (value: T) => void,
  options?: { default?: T; explicit?: string },
): WritableComputedRef<T | undefined, T> {
  const internal = shallowRef<T>();
  internal.value = options?.default;

  if (options?.explicit) {
    const key = options.explicit;
    const instance = getCurrentInstance();
    const explicit = () => isExplicit(key, instance?.vnode.props ?? null);
    return computed({
      get: () => (explicit() ? prop() : internal.value),
      set: (value: T) => {
        internal.value = value;
        emit(value);
      },
    });
  }

  return computed({
    get: () => prop() ?? internal.value,
    set: (value: T) => {
      internal.value = value;
      emit(value);
    },
  });
}
