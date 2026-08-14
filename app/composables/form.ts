import type { Service, Field } from "../types/data/form";

import { computed } from "vue";

import { useServiceRefs } from "./refs";
import { resolve } from "../utils/controls";

/**
 * The view surface of the form feature, shared by every form component: the
 * service's state as refs plus the per-field scope.
 */
export const useForm = <T>(form: Service<T>) => {
  const serviceRefs = useServiceRefs(form);

  /**
   * The per-field scope: the field's live value and error, and the resolved
   * control (which core component renders it) with its recipes.
   */
  const useField = (field: Field<T>) => {
    const key = String(field.key);

    const value = computed(() => form.payload[field.key]);

    const error = computed(() =>
      form.touched.has(key) ? form.errors[key] : undefined,
    );

    const resolved = computed(() =>
      resolve<T>(form, field, value.value, error.value),
    );

    const control = computed(() => resolved.value.control);

    const recipes = computed(() => resolved.value.recipes);

    return { key, value, error, control, recipes };
  };

  return { ...serviceRefs, useField };
};
