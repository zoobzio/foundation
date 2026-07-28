<script lang="ts">
import type {
  FormInputContext,
  FormInputPassthrough,
  FormInputProps,
} from "#foundation/types/data/form/fields/input";
import type { ComponentPublicInstance } from "vue";

import Input from "#foundation/components/common/input.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useContext } from "#foundation/composables/context";
import { useFormField } from "#foundation/composables/field";
</script>

<script setup lang="ts" generic="T">
const { form, field, pt } = defineProps<FormInputProps<T>>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const { key, value, error } = useFormField(form, field);

const settings = usePassthrough<FormInputPassthrough>(() => ({
  pt,
  recipes: {
    input: {
      value: value.value,
      type: field.type,
      placeholder: field.placeholder,
      disabled: field.disabled,
      required: field.required,
      aria: { invalid: !!error.value },
      onInput: (event: Event) => {
        if (event.target instanceof HTMLInputElement) {
          form.setValue(field.key, event.target.value);
        }
      },
      onBlur: () => {
        form.touch(field.key);
        form.validateField(field.key);
      },
    },
  },
}));

const ctx = useContext<FormInputContext<T>>("data-form-input", () => ({
  form,
  field,
  value: value.value,
  error: error.value,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
</script>

<template>
  <Input ref="el" v-bind="settings.input" class="f-data-form-input" />
</template>
