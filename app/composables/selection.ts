import type { Option } from "../types/core/common";
import type { MaybeRefOrGetter, Ref } from "vue";

import {
  SELECT_TRUNCATE,
  SELECT_PLACEHOLDER,
} from "../constants/select";
import { computed, toValue } from "vue";

export const useSelection = <T extends Option>(
  active: Ref<T | T[] | undefined>,
  settings?: MaybeRefOrGetter<{
    placeholder?: string;
    truncate?: number;
    multiple?: boolean;
  }>,
) => {
  const display = computed(() => {
    const { placeholder, truncate } = toValue(settings) ?? {};
    if (!active.value) {
      return placeholder ?? SELECT_PLACEHOLDER;
    }
    if (Array.isArray(active.value)) {
      if (active.value.length === 0) {
        return placeholder ?? SELECT_PLACEHOLDER;
      }
      return active.value
        .slice(0, truncate ?? SELECT_TRUNCATE)
        .map((s) => s.label)
        .join(", ");
    }
    return active.value.label;
  });

  const selected = (option: T) => {
    if (!active.value) {
      return false;
    }
    if (Array.isArray(active.value)) {
      return active.value.findIndex(({ value }) => value === option.value) >= 0;
    }
    return active.value.value === option.value;
  };

  const toggle = (option: T) => {
    const { multiple } = toValue(settings) ?? {};
    if (active.value === undefined) {
      active.value = multiple ? [option] : option;
      return;
    }
    if (Array.isArray(active.value)) {
      const needle = active.value.findIndex(
        ({ value }) => value === option.value,
      );
      if (needle >= 0) {
        active.value = active.value.filter(
          ({ value }) => value !== option.value,
        );
      } else {
        active.value = [...active.value, option];
      }
      return;
    }
    active.value = active.value.value === option.value ? undefined : option;
  };

  const clear = () => {
    active.value = undefined;
  };

  return { display, selected, toggle, clear };
};
