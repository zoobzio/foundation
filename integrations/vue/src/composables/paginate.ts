import type { MaybeRefOrGetter, Ref } from "vue";

import { computed, toValue } from "vue";
import { paginate } from "../utils/paginate";

/**
 * Page navigation over a page count. Moves outside `1..count` are ignored.
 *
 * @param page - The current page, 1-based.
 * @param count - The total page count.
 */
export const usePaginate = (
  page: Ref<number>,
  count: MaybeRefOrGetter<number>,
) => {
  const hasPrev = computed(() => page.value > 1);
  const hasNext = computed(() => page.value < toValue(count));
  const options = computed(() => paginate(page.value, toValue(count)));

  const goToPage = (p: number) => {
    if (p >= 1 && p <= toValue(count)) {
      page.value = p;
    }
  };

  const first = () => goToPage(1);
  const prev = () => goToPage(page.value - 1);
  const next = () => goToPage(page.value + 1);
  const last = () => goToPage(toValue(count));

  return {
    hasPrev,
    hasNext,
    options,
    goToPage,
    first,
    prev,
    next,
    last,
  };
};
