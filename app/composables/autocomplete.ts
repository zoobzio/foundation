import type { Service } from "#foundation/types/data/autocomplete";
import type {
  AutocompleteItemAnchor,
  AutocompleteItemPassthrough,
} from "#foundation/types/data/autocomplete/item";
import type {
  ComponentPublicInstance,
  MaybeRefOrGetter,
  ShallowRef,
} from "vue";

import { computed, nextTick, toValue, watch } from "#imports";
import { useServiceRefs } from "#foundation/composables/refs";

import { AUTOCOMPLETE_BLUR_DELAY_MS } from "#foundation/constants/autocomplete";

/**
 * The view surface of the autocomplete feature, shared by every autocomplete
 * component: the service's state as refs, the input's native surface
 * (keyboard navigation, input/focus/blur), the input recipe, and the per-item
 * scope. Pass the widget's `el` to keep the highlighted item scrolled into
 * view; items skip it.
 */
export const useAutocomplete = <M>(
  autocomplete: Service<M>,
  el?: Readonly<ShallowRef<ComponentPublicInstance | null>>,
) => {
  const serviceRefs = useServiceRefs(autocomplete);

  const onKeydown = (event: KeyboardEvent) => {
    if (autocomplete.dropdown) {
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
        const item = autocomplete.highlighted;
        if (item && !item.disabled) {
          autocomplete.select(item);
        } else {
          autocomplete.submit(autocomplete.input);
        }
        return;
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      autocomplete.submit(autocomplete.input);
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
  if (el) {
    watch(
      () => autocomplete.highlight,
      () => {
        nextTick(() => {
          const root = el.value?.$el;
          if (root instanceof HTMLElement) {
            root
              .querySelector(".f-data-autocomplete-item--highlighted")
              ?.scrollIntoView({ block: "nearest" });
          }
        });
      },
    );
  }

  const recipes = computed(() => ({
    input: {
      placeholder: autocomplete.config.placeholder,
      value: autocomplete.input,
      onInput,
      onKeydown,
      onFocus,
      onBlur,
    },
  }));

  /**
   * The per-item scope: derives the item's panel standing
   * (locked/highlighted) from the machine and maps clicks to unwind/select.
   * Takes a reactive source for the item's render position, which changes as
   * panels shift.
   */
  const useItem = (source: MaybeRefOrGetter<AutocompleteItemAnchor<M>>) => {
    const locked = computed(
      () => toValue(source).panel < autocomplete.panels.length - 1,
    );

    const highlighted = computed(
      () =>
        !locked.value && toValue(source).index === autocomplete.highlight,
    );

    const onClick = () => {
      const { item, panel } = toValue(source);
      if (locked.value) {
        autocomplete.unwind(panel);
        return;
      }
      if (!item.disabled) autocomplete.select(item);
    };

    const itemRecipes = computed<
      Pick<AutocompleteItemPassthrough, "root" | "arrow">
    >(() => ({
      root: {
        type: "button",
        disabled: toValue(source).item.disabled,
        onClick,
      },
      arrow: {
        alias: "chevron-right",
      },
    }));

    return { locked, highlighted, recipes: itemRecipes };
  };

  return { ...serviceRefs, recipes, useItem };
};
