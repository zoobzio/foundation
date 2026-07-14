import type { Ref } from "#imports";
import type { AutocompleteItem } from "#foundation/types/core/autocomplete";
import type { ShallowRef } from "vue";
import type { DataTableColumn, Table } from "#foundation/types/data/table";
import { unravelFilter } from "#foundation/utils/unravel";

/**
 * Composable that handles backspace-unraveling of the last filter
 * back into the autocomplete input state.
 *
 * Returns `tryUnravel()` which attempts to unravel the last filter.
 * If successful, it applies the result to the provided refs and
 * handles side effects (removing filters, updating facets).
 * Returns true if unraveled, false if fallback removal was used.
 */
export function useFilterUnravel<T, K = unknown>(
  table: Table<T, K>,
  state: {
    inputValue: Ref<string>;
    lockedField: ShallowRef<DataTableColumn<T> | null>;
    lockedOperator: Ref<string | null>;
    lockedDate1: Ref<string | null>;
    lockedSteps: Ref<AutocompleteItem[]>;
  },
) {
  const { filters, removeFilter, selectedFacets, columns } = table;

  const tryUnravel = () => {
    if (!filters.value.length) return false;

    const lastIndex = filters.value.length - 1;
    const lastFilter = filters.value[lastIndex]!;

    const result = unravelFilter(
      lastFilter,
      lastIndex,
      columns as DataTableColumn<T>[],
    );

    if (result) {
      // Apply side effects
      if (result.removeFacetKey) {
        selectedFacets.value = new Set(
          [...selectedFacets.value].filter((v) => v !== result.removeFacetKey),
        );
      }
      if (result.removeIndex >= 0) {
        removeFilter(result.removeIndex);
      }

      // Apply state
      state.inputValue.value = result.inputValue;
      state.lockedField.value = result.lockedField;
      state.lockedOperator.value = result.lockedOperator;
      state.lockedDate1.value = result.lockedDate1;
      state.lockedSteps.value = result.lockedSteps;
      return true;
    }

    // Fallback — just remove the filter
    removeFilter(lastIndex);
    return true;
  };

  return { tryUnravel };
}
