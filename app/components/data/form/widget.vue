<script lang="ts">
import type {
  FormWidgetContext,
  FormWidgetEmits,
  FormWidgetPassthrough,
  FormWidgetProps,
  FormWidgetSlots,
} from "../../../types/data/form/widget";
import type { Events } from "../../../types/data/form";
import type { ComponentPublicInstance } from "vue";

import Button from "../../common/button.vue";
import Field from "./field.vue";
import Form from "../../common/form.vue";
import Group from "../../common/group.vue";
import Scroller from "../../core/scroller.vue";
import Span from "../../common/span.vue";

import { useTemplateRef } from "#imports";
import { useForm } from "../../../composables/form";
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

const { submitting } = useForm(service);

const el = useTemplateRef<ComponentPublicInstance>("el");

const onSubmit = (e: Event) => {
  e.preventDefault();
  service.submit();
};

const settings = usePassthrough<FormWidgetPassthrough>(() => ({
  pt,
  recipes: {
    root: {},
    toolbar: {},
    title: {},
    scroller: {},
    inner: {
      onSubmit,
    },
    grid: {},
    footer: {},
    submit: {
      type: "button",
      disabled: submitting.value,
      onClick: onSubmit,
    },
    reset: {
      type: "button",
      onClick: () => service.reset(),
    },
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
  <Group ref="el" v-bind="settings.root" class="f-data-form">
    <slot name="toolbar" v-bind="ctx">
      <Group v-bind="settings.toolbar" class="f-data-form-toolbar">
        <Span v-bind="settings.title" class="f-data-form-title">
          {{ service.config.title }}
        </Span>
      </Group>
    </slot>
    <Scroller v-bind="settings.scroller">
      <template #content>
        <Form v-bind="settings.inner" class="f-data-form-inner">
          <Group v-bind="settings.grid" class="f-data-form-grid">
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
          </Group>
        </Form>
      </template>
    </Scroller>
    <slot name="footer" v-bind="ctx">
      <Group v-bind="settings.footer" class="f-data-form-footer">
        <Button v-bind="settings.reset" class="f-data-form-reset">
          Reset
        </Button>
        <Button v-bind="settings.submit" class="f-data-form-submit">
          {{ submitting ? "Submitting..." : "Submit" }}
        </Button>
      </Group>
    </slot>
  </Group>
</template>
