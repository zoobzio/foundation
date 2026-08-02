import type { Form, Field } from "#foundation/types/data/form";

import { computed } from "vue";

import { resolve } from "#foundation/utils/controls";

export const useFormField = <T>(form: Form<T>, field: Field<T>) => {
  const key = String(field.key);

  const value = computed(() => form.payload.value[field.key]);

  const error = computed(() =>
    form.touched.value.has(key) ? form.errors.value[key] : undefined,
  );

  const resolved = computed(() =>
    resolve<T>(form, field, value.value, error.value),
  );

  const control = computed(() => resolved.value.control);

  const recipes = computed(() => resolved.value.recipes);

  return { key, value, error, control, recipes };
};
