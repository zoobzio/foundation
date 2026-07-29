import type { Form, Config, Actions } from "#foundation/types/data/form";
import type { FormSnapshot } from "#foundation/schemas/form";

import { accessForm } from "#foundation/stores/form";
import { computed, useNuxtApp } from "#imports";
import { useLogger } from "#foundation/composables/log";

export const createForm = <T>(
  id: string,
  config: Config<T>,
  actions: Actions<T>,
) => {
  const nuxt = useNuxtApp();
  const log = useLogger(`form-${id}`);

  const state = accessForm(id, config);
  const { initialized, values, errors, touched, submitting, submitted } = state;

  return (): Form<T> => {
    const valid = computed(() => {
      const result = config.schema.safeParse(values.value);
      return result.success;
    });

    const initialize = async () => {
      if (initialized.value) return true;
      if (actions.init) {
        log.debug("Form initializing", { id });
        try {
          await actions.init(state);
        } catch (cause) {
          log.error("Failed to initialize form", {
            id,
            config,
            cause,
          });
          throw cause;
        }
      }
      return (initialized.value = true);
    };

    const validate = (key?: keyof T): boolean => {
      const result = config.schema.safeParse(values.value);
      if (result.success) return true;

      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".");
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      }

      if (key) {
        const k = String(key);
        const { [k]: _, ...rest } = errors.value;
        errors.value = fieldErrors[k] ? { ...rest, [k]: fieldErrors[k] } : rest;
        return errors.value[k] === undefined;
      }

      errors.value = fieldErrors;
      const allKeys = config.fields.map((f) => String(f.key));
      touched.value = new Set(allKeys);
      log.debug("Form validation failed", { id, errors: fieldErrors });
      return Object.keys(fieldErrors).length === 0;
    };

    const set = (key: keyof T, value: unknown) => {
      values.value = { ...values.value, [key]: value };
    };

    const touch = (key: keyof T) => {
      const next = new Set(touched.value);
      next.add(String(key));
      touched.value = next;
    };

    const submit = async () => {
      if (!validate()) return;
      submitting.value = true;
      log.debug("Form submitting", { id, values: values.value });
      try {
        const result = config.schema.parse(values.value);
        if (actions.submit) {
          await actions.submit(state);
        }
        submitted.value = true;
        log.debug("Form submitted", { id, data: result });
        nuxt.callHook("widget:form:submitted", {
          id,
          data: result,
        });
      } catch (cause) {
        log.error("Form submission failed", { id, cause });
        throw cause;
      } finally {
        submitting.value = false;
        nuxt.callHook("widget:form:snapshot", {
          id,
          snapshot: snap(),
        });
      }
    };

    const update = (data: Partial<T>) => {
      values.value = { ...values.value, ...data };
      log.debug("Form updated", { id, values: values.value });
    };

    const reset = () => {
      log.debug("Form reset", { id });
      values.value = { ...config.defaults };
      errors.value = {};
      touched.value = new Set();
      submitted.value = false;
    };

    const snap = (): FormSnapshot => ({
      values: values.value,
      touched: [...touched.value],
    });

    const restore = (snapshot: FormSnapshot) => {
      values.value = { ...config.defaults, ...snapshot.values };
      touched.value = new Set(snapshot.touched);
      log.debug("Form snapshot restored", { id, snapshot });
    };

    return {
      // config
      id,
      config,
      // state
      initialized,
      values,
      errors,
      touched,
      submitting,
      submitted,
      valid,
      // actions
      initialize,
      set,
      update,
      touch,
      validate,
      submit,
      reset,
      snap,
      restore,
    };
  };
};
