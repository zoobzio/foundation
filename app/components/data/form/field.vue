<script lang="ts">
import type {
  FormFieldContext,
  FormFieldPassthrough,
  FormFieldProps,
  FormFieldSlots,
} from "../../../types/data/form/field";

import Checkbox from "../../core/checkbox.vue";
import DatePicker from "../../core/date-picker.vue";
import MultiSelect from "../../core/multi-select.vue";
import Radio from "../../core/radio.vue";
import Select from "../../core/select.vue";
import TagsInput from "../../core/tags-input.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import { useFormView } from "../../../composables/form";
</script>

<script setup lang="ts" generic="T">
const { form, field, pt } = defineProps<FormFieldProps<T>>();

const el = useTemplateRef<HTMLDivElement>("el");

const { useField } = useFormView(form);
const { value, error, control, recipes } = useField(field);

const settings = usePassthrough<FormFieldPassthrough>(() => ({
  pt,
  recipes: {
    ...recipes.value,
  },
}));

const ctx = useContext<FormFieldContext<T>>("data-form-field", () => ({
  form,
  field,
  value: value.value,
  error: error.value,
  el: el.value,
  control: control.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<FormFieldSlots<T>>();
</script>

<template>
  <div
    ref="el"
    class="f-group f-data-form-field"
    :style="{ gridColumn: `span ${field.colspan ?? 12}` }"
  >
    <slot name="label" v-bind="ctx">
      <label class="f-label f-data-form-field-label">
        {{ field.label }}
      </label>
    </slot>
    <slot v-if="control === 'input'" name="input" v-bind="ctx">
      <input v-bind="settings.input" class="f-input f-data-form-input" >
    </slot>
    <slot v-else-if="control === 'textarea'" name="textarea" v-bind="ctx">
      <textarea
        v-bind="settings.textarea"
        class="f-textarea f-data-form-textarea"
      />
    </slot>
    <slot v-else-if="control === 'select'" name="select" v-bind="ctx">
      <Select v-bind="settings.select" class="f-data-form-select" />
    </slot>
    <slot v-else-if="control === 'multiSelect'" name="multiSelect" v-bind="ctx">
      <MultiSelect
        v-bind="settings.multiSelect"
        class="f-data-form-multi-select"
      />
    </slot>
    <slot v-else-if="control === 'checkbox'" name="checkbox" v-bind="ctx">
      <Checkbox v-bind="settings.checkbox" class="f-data-form-checkbox" />
    </slot>
    <slot v-else-if="control === 'radio'" name="radio" v-bind="ctx">
      <Radio v-bind="settings.radio" class="f-data-form-radio" />
    </slot>
    <slot v-else-if="control === 'datePicker'" name="datePicker" v-bind="ctx">
      <DatePicker v-bind="settings.datePicker" class="f-data-form-date" />
    </slot>
    <slot v-else-if="control === 'tagsInput'" name="tagsInput" v-bind="ctx">
      <TagsInput v-bind="settings.tagsInput" class="f-data-form-tags-input" />
    </slot>
    <slot v-if="error" name="error" v-bind="ctx">
      <div class="f-caption f-data-form-field-error">
        {{ error }}
      </div>
    </slot>
  </div>
</template>
