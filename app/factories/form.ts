import type { Form, Config, Actions, Keys } from "#foundation/types/data/form";

import { accessForm } from "#foundation/stores/form";
import { computed, useNuxtApp } from "#imports";
import { FormService } from "#foundation/services/form";

export const createForm = <T>(
  id: string,
  config: Config<T>,
  actions: Actions<T>,
) => {
  return (): Form<T> => {
    const nuxt = useNuxtApp();
    const state = accessForm(id, config);
    const service = new FormService(nuxt, id, config, state, actions);

    function set<K extends keyof T>(key: K, value: T[K] | undefined): void;
    function set<V>(key: Keys<T, V>, value: V | undefined): void;
    function set<K extends keyof T>(key: K, value: T[K] | undefined): void {
      service.set(key, value);
    }

    return {
      id,
      config,

      initialized: computed(() => service.initialized),
      payload: computed({
        get: () => service.payload,
        set: (data) => service.update(data),
      }),
      errors: computed(() => service.errors),
      touched: computed(() => service.touched),
      submitting: computed(() => service.submitting),
      submitted: computed(() => service.submitted),
      valid: computed(() => service.valid),

      initialize: () => service.initialize(),
      check: (key: keyof T) => service.check(key),
      validate: (data?: Partial<T>) => service.validate(data),
      set,
      update: (data: Partial<T>) => service.update(data),
      restore: (data: T) => service.restore(data),
      touch: (key: keyof T) => service.touch(key),
      submit: () => service.submit(),
      reset: () => service.reset(),
    };
  };
};
