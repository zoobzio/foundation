import { computed, inject, useNuxtApp, useState } from "#imports";
import { WIDGET_CONFIGS } from "#foundation/constants/data/table";
import type { Form, DataFormConfig } from "#foundation/types/data/form";
import { DataFormSnapshotSchema } from "#foundation/schemas/data/form";
import type { DataFormSnapshot } from "#foundation/schemas/data/form";

export const createForm = <T>(id: string, config: DataFormConfig<T>) => {
  return (): Form<T> => {
    const configs = inject(WIDGET_CONFIGS, {});
    const defaults = DataFormSnapshotSchema.parse(configs[id] ?? {});

    // Initialization
    const initialized = useState<boolean>(
      `form-${id}-initialized`,
      () => false,
    );

    // State
    const values = useState<Partial<T>>(
      `form-${id}-values`,
      () => ({ ...config.defaults, ...defaults.values } as Partial<T>),
    );
    const errors = useState<Record<string, string>>(
      `form-${id}-errors`,
      () => ({}),
    );
    const touched = useState<Set<string>>(
      `form-${id}-touched`,
      () => new Set(defaults.touched),
    );
    const submitting = useState<boolean>(
      `form-${id}-submitting`,
      () => false,
    );
    const submitted = useState<boolean>(
      `form-${id}-submitted`,
      () => false,
    );

    // Validation
    const runValidation = (): Record<string, string> => {
      const result = config.schema.safeParse(values.value);
      if (result.success) return {};
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }
      return fieldErrors;
    };

    const valid = computed(() => {
      const result = config.schema.safeParse(values.value);
      return result.success;
    });

    const validate = (): boolean => {
      const fieldErrors = runValidation();
      errors.value = fieldErrors;
      // Touch all fields on full validation
      const allKeys = config.fields.map((f) => String(f.key));
      touched.value = new Set(allKeys);
      return Object.keys(fieldErrors).length === 0;
    };

    const validateField = (key: keyof T) => {
      const fieldErrors = runValidation();
      const k = String(key);
      const { [k]: _, ...rest } = errors.value;
      errors.value = fieldErrors[k] ? { ...rest, [k]: fieldErrors[k] } : rest;
    };

    // Actions
    const setValue = <K extends keyof T>(key: K, value: T[K]) => {
      values.value = { ...values.value, [key]: value };
    };

    const touch = (key: keyof T) => {
      const next = new Set(touched.value);
      next.add(String(key));
      touched.value = next;
    };

    const submitForm = async () => {
      if (!validate()) return;
      submitting.value = true;
      try {
        const result = config.schema.parse(values.value);
        await config.submit(result);
        submitted.value = true;
        useNuxtApp().callHook("widget:form:submitted", {
          id,
          data: result,
        });
      } finally {
        submitting.value = false;
        useNuxtApp().callHook("widget:form:snapshot", {
          id,
          snapshot: getSnapshot(),
        });
      }
    };

    const reset = () => {
      values.value = { ...config.defaults } as Partial<T>;
      errors.value = {};
      touched.value = new Set();
      submitted.value = false;
    };

    // Persistence
    const getSnapshot = (): DataFormSnapshot => ({
      values: values.value as Record<string, unknown>,
      touched: [...touched.value],
    });

    const restoreSnapshot = (snapshot: DataFormSnapshot) => {
      values.value = snapshot.values as Partial<T>;
      touched.value = new Set(snapshot.touched);
    };

    // Init
    const init = async () => {
      if (initialized.value) return true;
      initialized.value = true;
      return true;
    };

    return {
      values,
      errors,
      touched,
      submitting,
      submitted,
      valid,
      title: config.title,
      fields: config.fields,
      setValue,
      touch,
      validate,
      validateField,
      submit: submitForm,
      reset,
      getSnapshot,
      restoreSnapshot,
      init,
      initialized,
    };
  };
};
