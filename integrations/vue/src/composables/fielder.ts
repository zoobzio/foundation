import type { FormFieldResolved } from "../types/components/form-field";
import type { ComputedRef, MaybeRefOrGetter } from "vue";
import type { Field, Service } from "@zoobzio/form";

import { computed, toValue } from "vue";
import { fielder } from "../utils/fielder";

/**
 * Resolves a field to its control: seats the field's recipe in an
 * otherwise-blank manifest, so the field's single `usePassthrough` covers
 * every entry and `settings` stays the source of truth.
 *
 * @param source - A reactive source of the service and the field config.
 * The field's value and error are read inside the computed, so the recipes
 * follow the payload.
 * @returns The active control and the full recipe manifest.
 */
export const useFielder = <T>(
  source: MaybeRefOrGetter<{ form: Service<T>; field: Field<T> }>,
): ComputedRef<FormFieldResolved> =>
  computed(() => {
    const { form, field } = toValue(source);
    return fielder(form, field);
  });
