import type { WritableComputedRef } from "vue";

import { computed, getCurrentInstance, shallowRef } from "vue";

/**
 * A writable model that falls back to local state when the prop is absent.
 *
 * @param prop - A getter for the model prop.
 * @param emit - Emits the `update:*` event.
 * @param options.default - The initial local value.
 * @param options.explicit - The prop name. When set, presence of the prop on
 * the vnode decides control, so an explicit `undefined` is a controlled value.
 */
export const useModel = <T>(
  prop: () => T | undefined,
  emit: (value: T) => void,
  options?: { default?: T; explicit?: string },
): WritableComputedRef<T | undefined, T> => {
  const internal = shallowRef<T>();
  internal.value = options?.default;

  if (options?.explicit) {
    const key = options.explicit;
    const kebab = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    const instance = getCurrentInstance();
    const provided = () => {
      const vnodeProps = instance?.vnode.props;
      return !!vnodeProps && (key in vnodeProps || kebab in vnodeProps);
    };
    return computed({
      get: () => (provided() ? prop() : internal.value),
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
};
