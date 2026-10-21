import type { Option } from "../types/common";
import type { MaybeRefOrGetter, Ref } from "vue";

import { computed, toValue } from "vue";

/**
 * Case-insensitive substring search over grouped options. A group is any
 * record with an `options` array; its other fields pass through `results`.
 *
 * @param search - The search text.
 * @param groups - The groups to filter.
 * @param settings.keys - The option fields to search. Defaults to `label`.
 * @param settings.filter - An extra predicate an option must pass alongside
 * the text match.
 * @returns `match` tests one option; `results` is `groups` with non-matching
 * options and then empty groups removed; `hasResults` is whether any remain.
 */
export const useSearch = <
  G extends { options: T[] },
  T extends Option = G["options"][number],
>(
  search: Ref<string | undefined>,
  groups: MaybeRefOrGetter<G[]>,
  settings?: MaybeRefOrGetter<{
    keys?: NoInfer<keyof T & string>[];
    filter?: (item: T) => boolean;
  }>,
) => {
  const index = computed(() => {
    const { keys } = toValue(settings) ?? {};
    const fields = keys ?? ["label"];
    const entries = new Map<T, string>();
    for (const group of toValue(groups)) {
      for (const item of group.options) {
        entries.set(
          item,
          fields
            .map((key) => item[key])
            .filter((field) => typeof field === "string")
            .join(" ")
            .toLowerCase(),
        );
      }
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

  const results = computed(() => {
    const { filter } = toValue(settings) ?? {};
    return toValue(groups)
      .map((group) => ({
        ...group,
        options: group.options.filter(
          (item) => match(item) && (filter?.(item) ?? true),
        ),
      }))
      .filter((group) => group.options.length > 0);
  });

  const hasResults = computed(() => results.value.length > 0);

  return {
    match,
    results,
    hasResults,
  };
};
