<script lang="ts">
import type {
  FormWidgetContext,
  FormWidgetEmits,
  FormWidgetPassthrough,
  FormWidgetProps,
  FormWidgetSlots,
} from "../../../types/data/form/widget";
import type { Events } from "../../../types/data/form";

import Field from "./field.vue";
import Scroller from "../../core/scroller.vue";

import { useTemplateRef } from "#imports";
import { useFormView } from "../../../composables/form";
import { useHooks } from "../../../composables/hook";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import { useForwardSlots } from "../../../composables/slots";
import { useLazyRequest } from "../../../composables/request";
import { FORM_FIELD_SLOTS } from "../../../constants/form";
</script>

<script setup lang="ts" generic="T">
const { service, pt } = defineProps<FormWidgetProps<T>>();

const emit = defineEmits<FormWidgetEmits<T>>();

useHooks<Events<T>>(service.id, {
  "form:initialized": (event) => emit("initialized", event),
  "form:submitted": (event) => emit("submitted", event),
  "form:rejected": (event) => emit("rejected", event),
  "form:restored": (event) => emit("restored", event),
  "form:reset": (event) => emit("reset", event),
});

const { submitting } = useFormView(service);

const el = useTemplateRef<HTMLDivElement>("el");

const onSubmit = (e: Event) => {
  e.preventDefault();
  service.submit();
};

const settings = usePassthrough<FormWidgetPassthrough>(() => ({
  pt,
  recipes: {
    scroller: {},
  },
}));

const ctx = useContext<FormWidgetContext<T>>("data-form", () => ({
  form: service,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });

const slots = defineSlots<FormWidgetSlots<T>>();
const forwarded = useForwardSlots(slots, FORM_FIELD_SLOTS);

useLazyRequest(`init-form-${service.id}`, () => service.initialize());
</script>

<template>
  <div ref="el" class="f-group f-data-form">
    <slot name="toolbar" v-bind="ctx">
      <div class="f-group f-data-form-toolbar">
        <span class="f-span f-data-form-title">
          {{ service.config.title }}
        </span>
      </div>
    </slot>
    <Scroller v-bind="settings.scroller">
      <template #content>
        <form class="f-form f-data-form-inner" @submit="onSubmit">
          <div class="f-group f-data-form-grid">
            <Field
              v-for="field in service.config.fields"
              :key="String(field.key)"
              :form="service"
              :field="field"
              :pt="pt?.fields?.[field.key]"
            >
              <template
                v-for="name in forwarded"
                :key="name"
                #[name]="slotProps"
              >
                <slot :name="name" v-bind="slotProps" />
              </template>
            </Field>
          </div>
        </form>
      </template>
    </Scroller>
    <slot name="footer" v-bind="ctx">
      <div class="f-group f-data-form-footer">
        <button
          type="button"
          class="f-button f-data-form-reset"
          @click="service.reset()"
        >
          Reset
        </button>
        <button
          type="button"
          class="f-button f-data-form-submit"
          :disabled="submitting"
          @click="onSubmit"
        >
          {{ submitting ? "Submitting..." : "Submit" }}
        </button>
      </div>
    </slot>
  </div>
</template>
