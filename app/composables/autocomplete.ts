import type { Autocomplete } from "#foundation/types/data/autocomplete";
import type {
  AutocompleteItemAnchor,
  AutocompleteItemPassthrough,
} from "#foundation/types/data/autocomplete/item";
import type { ComponentPublicInstance, MaybeRefOrGetter, ShallowRef } from "vue";

import { computed, nextTick, toValue, watch } from "#imports";

import { AUTOCOMPLETE_BLUR_DELAY_MS } from "#foundation/constants/autocomplete";

/**
 * The feature half of the autocomplete widget: binds the machine to the
 * input's native surface (keyboard navigation, input/focus/blur) and keeps
 * the highlighted item in view. Returns the recipes the widget spreads into
 * its passthrough manifest.
 */
export const useAutocomplete = <M>(
  autocomplete: Autocomplete<M>,
  el: Readonly<ShallowRef<ComponentPublicInstance | null>>,
) => {
  const { input, dropdown, highlight, highlighted } = autocomplete;

  const onKeydown = (event: KeyboardEvent) => {
    if (dropdown.value) {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        autocomplete.next();
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        autocomplete.prev();
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        const item = highlighted.value;
        if (item && !item.disabled) {
          autocomplete.select(item);
        } else {
          autocomplete.submit(input.value);
        }
        return;
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      autocomplete.submit(input.value);
      return;
    }

    // Forward all other keys (backspace, escape, etc.) to consumer actions
    autocomplete.keydown(event);
  };

  const onInput = (event: Event) => {
    if (event.target instanceof HTMLInputElement) {
      autocomplete.set(event.target.value);
    }
  };

  const onFocus = () => autocomplete.focus();

  // Delay clearing focus so a suggestion click can register first.
  const onBlur = () => {
    window.setTimeout(() => autocomplete.blur(), AUTOCOMPLETE_BLUR_DELAY_MS);
  };

  // Keep the highlighted item visible as keyboard navigation moves it.
  watch(highlight, () => {
    nextTick(() => {
      const root = el.value?.$el;
      if (root instanceof HTMLElement) {
        root
          .querySelector(".f-data-autocomplete-item--highlighted")
          ?.scrollIntoView({ block: "nearest" });
      }
    });
  });

  const recipes = computed(() => ({
    input: {
      placeholder: autocomplete.config.placeholder,
      value: input.value,
      onInput,
      onKeydown,
      onFocus,
      onBlur,
    },
  }));

  return { recipes };
};

/**
 * The feature half of an autocomplete item: derives its panel standing
 * (locked/highlighted) from the machine and maps clicks to unwind/select.
 * Takes a reactive source for the item's render position, which changes as
 * panels shift. Returns the recipes the item spreads into its passthrough
 * manifest.
 */
export const useAutocompleteItem = <M>(
  autocomplete: Autocomplete<M>,
  source: MaybeRefOrGetter<AutocompleteItemAnchor<M>>,
) => {
  const { panels, highlight } = autocomplete;

  const locked = computed(
    () => toValue(source).panel < panels.value.length - 1,
  );

  const highlighted = computed(
    () => !locked.value && toValue(source).index === highlight.value,
  );

  const onClick = () => {
    const { item, panel } = toValue(source);
    if (locked.value) {
      autocomplete.unwind(panel);
      return;
    }
    if (!item.disabled) autocomplete.select(item);
  };

  const recipes = computed<Pick<AutocompleteItemPassthrough, "root" | "arrow">>(
    () => ({
      root: {
        type: "button",
        disabled: toValue(source).item.disabled,
        onClick,
      },
      arrow: {
        alias: "chevron-right",
      },
    }),
  );

  return { locked, highlighted, recipes };
};
