import type {
  Autocomplete,
  Config,
  Actions,
} from "#foundation/types/data/autocomplete";

import { accessAutocomplete } from "#foundation/stores/autocomplete";
import { computed, useNuxtApp } from "#imports";
import { AutocompleteService } from "#foundation/services/autocomplete";

export const createAutocomplete = <M>(
  id: string,
  config: Config<M>,
  actions: Actions<M> = {},
) => {
  return (): Autocomplete<M> => {
    const nuxt = useNuxtApp();
    const state = accessAutocomplete<M>(id);
    const service = new AutocompleteService(nuxt, id, config, state, actions);
    return {
      id,
      config,

      input: computed({
        get: () => service.input,
        set: (value) => service.set(value),
      }),
      steps: computed({
        get: () => service.steps,
        set: (steps) => service.update(steps),
      }),
      focused: computed(() => service.focused),
      highlight: computed(() => service.highlight),

      suggestions: computed(() => service.suggestions),
      panels: computed(() => service.panels),
      hint: computed(() => service.hint),
      empty: computed(() => service.empty),
      dropdown: computed(() => service.dropdown),
      highlighted: computed(() => service.highlighted),

      set: (value: string) => service.set(value),
      update: (steps) => service.update(steps),
      reset: () => service.reset(),
      focus: () => service.focus(),
      blur: () => service.blur(),
      next: () => service.next(),
      prev: () => service.prev(),
      select: (item) => service.select(item),
      submit: (value: string) => service.submit(value),
      unwind: (index: number) => service.unwind(index),
      keydown: (event: KeyboardEvent) => service.keydown(event),
    };
  };
};
