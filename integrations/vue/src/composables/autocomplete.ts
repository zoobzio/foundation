import type {
  AutocompleteEmits,
  AutocompleteOption,
  AutocompleteProps,
} from "../types/components/autocomplete";
import type { EmitFn, MaybeRefOrGetter, Ref } from "vue";

import { computed, toValue } from "vue";
import { AUTOCOMPLETE_MORE_THRESHOLD } from "../constants/scroll";

/**
 * The feature half of the autocomplete: stacks the `trail` panels and `items`
 * into `panels`, routes input keys to `unwrap` and `submit`, guards `select`
 * against disabled options, and fires `more` once per crossing of a panel's
 * end.
 *
 * @param model - The input text model.
 * @param source - The `items`, `trail`, and `steps` props.
 * @param emit - The component's emit, for `select`, `submit`, `unwrap`, and
 * `more`.
 */
export const useAutocomplete = <M>(
  model: Ref<string | undefined>,
  source: MaybeRefOrGetter<
    Pick<AutocompleteProps<M>, "items" | "trail" | "steps">
  >,
  emit: EmitFn<
    Pick<AutocompleteEmits<M>, "select" | "submit" | "unwrap" | "more">
  >,
) => {
  const panels = computed(() => {
    const { items, trail = [] } = toValue(source);
    const result: AutocompleteOption<M>[][] = [...trail];
    if (items.length) result.push(items);
    return result;
  });

  const select = (option: AutocompleteOption<M>) => {
    if (!option.disabled) emit("select", option);
  };

  // Backspace on an empty input with chips present unwraps the last step; an
  // Enter reka did not claim for a highlighted item submits the text
  const onInputKeydown = (event: KeyboardEvent) => {
    const { steps = [] } = toValue(source);
    if (event.key === "Backspace" && !model.value && steps.length) {
      event.preventDefault();
      emit("unwrap");
      return;
    }
    if (event.key !== "Enter" || event.defaultPrevented) return;
    event.preventDefault();
    emit("submit", model.value ?? "");
  };

  // re-arms once the user scrolls away from the end, so `more` fires once per
  // crossing instead of per scroll tick
  let moreArmed = true;
  const onPanelScroll = (event: Event) => {
    const el = event.target;
    if (!(el instanceof HTMLElement)) return;
    const nearEnd =
      el.scrollTop + el.clientHeight >=
      el.scrollHeight - AUTOCOMPLETE_MORE_THRESHOLD;
    if (nearEnd && moreArmed) {
      moreArmed = false;
      emit("more");
    } else if (!nearEnd) {
      moreArmed = true;
    }
  };

  return {
    panels,
    select,
    onInputKeydown,
    onPanelScroll,
  };
};
