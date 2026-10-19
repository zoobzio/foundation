import type { WritableComputedRef } from "vue";

import { computed, getCurrentInstance, shallowRef } from "#imports";

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
