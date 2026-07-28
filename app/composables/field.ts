import type { Form, DataFormField } from "~/types/data/form";

import { computed } from "vue";

export const useFormField = <T>(form: Form<T>, field: DataFormField<T>) => {
  const key = String(field.key);

  const value = computed(() => form.values.value[field.key]);

  const error = computed(() =>
    form.touched.value.has(key) ? form.errors.value[key] : undefined,
  );

  return { key, value, error };
};
