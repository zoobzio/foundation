import type { Option } from "../types/core/common";
import type { MaybeRefOrGetter, Ref } from "vue";

import { computed, toValue } from "vue";

export const useSearch = <T extends Option>(
  search: Ref<string | undefined>,
  options: MaybeRefOrGetter<T[]>,
  settings?: MaybeRefOrGetter<{
    keys?: (keyof T & string)[];
  }>,
) => {
  const index = computed(() => {
    const { keys } = toValue(settings) ?? {};
    const fields = keys ?? ["label"];
    const entries = new Map<T, string>();
    for (const item of toValue(options)) {
      entries.set(
        item,
        fields
          .map((key) => item[key])
          .filter((field) => typeof field === "string")
          .join(" ")
          .toLowerCase(),
      );
    }
    return entries;
  });

  const match = (item: T) => {
    const needle = (search.value ?? "").trim().toLowerCase();
    if (needle.length === 0) {
      return true;
    }
    return (index.value.get(item) ?? "").includes(needle);
  };

  const results = computed(() => toValue(options).filter(match));

  return {
    match,
    results,
  };
};
