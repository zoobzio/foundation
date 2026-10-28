<script lang="ts">
import type {
  FormFieldContext,
  FormFieldPassthrough,
  FormFieldProps,
  FormFieldSlots,
} from "../types/components/form-field";

import Checkbox from "./checkbox.vue";
import DatePicker from "./date-picker.vue";
import FileInput from "./file-input.vue";
import MultiSelect from "./multi-select.vue";
import Radio from "./radio.vue";
import RichText from "./rich-text.vue";
import Select from "./select.vue";
import TagsInput from "./tags-input.vue";

import { useTemplateRef } from "vue";
import { usePassthrough } from "../composables/passthrough";
import { useContext } from "../composables/context";
import { useFielder } from "../composables/fielder";
import { FORM_FIELD_COLSPAN } from "../constants/form";
</script>

<script setup lang="ts" generic="T">
const { service, field, pt } = defineProps<FormFieldProps<T>>();

const el = useTemplateRef<HTMLDivElement>("el");

const resolved = useFielder<T>(() => ({ form: service, field }));

const settings = usePassthrough<FormFieldPassthrough>(() => ({
  pt,
  recipes: resolved.value.recipes,
}));

const ctx = useContext<FormFieldContext<T>>("form-field", () => ({
  form: service,
  field,
  ...service.field(field.key),
  control: resolved.value.control,
  ids: resolved.value.ids,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<FormFieldSlots<T>>();
</script>

<template>
  <div
    ref="el"
    class="f-group f-data-form-field"
    :style="{ gridColumn: `span ${field.colspan ?? FORM_FIELD_COLSPAN}` }"
  >
    <slot name="label" v-bind="ctx">
      <label
        :id="ctx.ids.label"
        :for="ctx.ids.control"
        class="f-label f-data-form-field-label"
      >
        {{ field.label }}
      </label>
    </slot>
    <slot v-if="ctx.control === 'input'" name="input" v-bind="ctx">
      <input v-bind="settings.input" class="f-input f-data-form-input" />
    </slot>
    <slot v-else-if="ctx.control === 'textarea'" name="textarea" v-bind="ctx">
      <textarea
        v-bind="settings.textarea"
        class="f-textarea f-data-form-textarea"
      />
    </slot>
    <slot v-else-if="ctx.control === 'select'" name="select" v-bind="ctx">
      <Select v-bind="settings.select" class="f-data-form-select" />
    </slot>
    <slot
      v-else-if="ctx.control === 'multiSelect'"
      name="multiSelect"
      v-bind="ctx"
    >
      <MultiSelect
        v-bind="settings.multiSelect"
        class="f-data-form-multi-select"
      />
    </slot>
    <slot v-else-if="ctx.control === 'checkbox'" name="checkbox" v-bind="ctx">
      <Checkbox v-bind="settings.checkbox" class="f-data-form-checkbox" />
    </slot>
    <slot v-else-if="ctx.control === 'radio'" name="radio" v-bind="ctx">
      <Radio v-bind="settings.radio" class="f-data-form-radio" />
    </slot>
    <slot
      v-else-if="ctx.control === 'datePicker'"
      name="datePicker"
      v-bind="ctx"
    >
      <DatePicker v-bind="settings.datePicker" class="f-data-form-date" />
    </slot>
    <slot v-else-if="ctx.control === 'tagsInput'" name="tagsInput" v-bind="ctx">
      <TagsInput v-bind="settings.tagsInput" class="f-data-form-tags-input" />
    </slot>
    <slot v-else-if="ctx.control === 'fileInput'" name="fileInput" v-bind="ctx">
      <FileInput v-bind="settings.fileInput" class="f-data-form-file-input" />
    </slot>
    <slot v-else-if="ctx.control === 'richText'" name="richText" v-bind="ctx">
      <RichText v-bind="settings.richText" class="f-data-form-rich-text" />
    </slot>
    <slot v-if="field.hint" name="hint" v-bind="ctx">
      <div :id="ctx.ids.hint" class="f-caption f-data-form-field-hint">
        {{ field.hint }}
      </div>
    </slot>
    <slot v-if="ctx.error" name="error" v-bind="ctx">
      <div :id="ctx.ids.error" class="f-caption f-data-form-field-error">
        {{ ctx.error }}
      </div>
    </slot>
  </div>
</template>
