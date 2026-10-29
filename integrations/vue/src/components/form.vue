<script lang="ts">
import type {
  FormContext,
  FormEmits,
  FormPassthrough,
  FormProps,
  FormSlots,
} from "../types/components/form";
import type { Field } from "@zoobzio/form";

import FormField from "./form-field.vue";

import { useTemplateRef } from "vue";
import { useServiceEmits } from "../composables/events";
import { useForward } from "../composables/forward";
import { useRefs } from "../composables/ref";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import {
  FORM_EVENTS,
  FORM_RESET_LABEL,
  FORM_SUBMIT_LABEL,
  FORM_SUBMITTING_LABEL,
} from "../constants/form";
</script>

<script setup lang="ts" generic="T">
const { service, pt } = defineProps<FormProps<T>>();

const emit = defineEmits<FormEmits<T>>();

useServiceEmits(service, FORM_EVENTS, emit);

const el = useTemplateRef<HTMLFormElement>("el");

const { submitting } = useRefs(service);

const settings = usePassthrough<FormPassthrough<T>>(() => ({
  pt,
  recipes: {
    form: {
      onSubmit: (e) => {
        e.preventDefault();
        service.submit().catch(() => {});
      },
      onReset: (e) => {
        e.preventDefault();
        service.reset();
      },
    },
    reset: { type: "reset" },
    submit: { type: "submit", disabled: submitting.value },
    field: (field) => ({
      as: FormField,
      service,
      field,
      pt: pt?.fields?.[field.key],
    }),
  },
}));

const ctx = useContext<FormContext<T>>("form", () => ({
  form: service,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });

const slots = defineSlots<FormSlots<T>>();

const FField = useForward({
  props: ({ field }: { field: Field<T> }) => settings.value.field(field),
  slots,
});
</script>

<template>
  <form ref="el" class="f-form f-data-form" v-bind="settings.form">
    <div class="f-group f-data-form-grid">
      <FField
        v-for="field in service.config.fields"
        :key="String(field.key)"
        :field="field"
      />
    </div>
    <slot name="footer" v-bind="ctx">
      <div class="f-group f-data-form-footer">
        <button class="f-button f-data-form-reset" v-bind="settings.reset">
          {{ FORM_RESET_LABEL }}
        </button>
        <button class="f-button f-data-form-submit" v-bind="settings.submit">
          {{ submitting ? FORM_SUBMITTING_LABEL : FORM_SUBMIT_LABEL }}
        </button>
      </div>
    </slot>
  </form>
</template>
