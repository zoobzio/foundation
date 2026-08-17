<script lang="ts">
import type {
  FormFieldContext,
  FormFieldPassthrough,
  FormFieldProps,
  FormFieldSlots,
} from "../../../types/data/form/field";
import type { ComponentPublicInstance } from "vue";

import Caption from "../../common/caption.vue";
import Checkbox from "../../core/checkbox.vue";
import DatePicker from "../../core/date-picker.vue";
import Group from "../../common/group.vue";
import Input from "../../common/input.vue";
import Label from "../../common/label.vue";
import MultiSelect from "../../core/multi-select.vue";
import Radio from "../../core/radio.vue";
import Select from "../../core/select.vue";
import TagsInput from "../../core/tags-input.vue";
import Textarea from "../../common/textarea.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../../composables/passthrough";
import { useContext } from "../../../composables/context";
import { useFormView } from "../../../composables/form";
</script>

<script setup lang="ts" generic="T">
const { form, field, pt } = defineProps<FormFieldProps<T>>();

const el = useTemplateRef<ComponentPublicInstance>("el");

const { useField } = useFormView(form);
const { value, error, control, recipes } = useField(field);

const settings = usePassthrough<FormFieldPassthrough>(() => ({
  pt,
  recipes: {
    root: {},
    label: {},
    error: {},
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
  <Group
    ref="el"
    v-bind="settings.root"
    class="f-data-form-field"
    :style="{ gridColumn: `span ${field.colspan ?? 12}` }"
  >
    <slot name="label" v-bind="ctx">
      <Label v-bind="settings.label" class="f-data-form-field-label">
        {{ field.label }}
      </Label>
    </slot>
    <slot v-if="control === 'input'" name="input" v-bind="ctx">
      <Input v-bind="settings.input" class="f-data-form-input" />
    </slot>
    <slot v-else-if="control === 'textarea'" name="textarea" v-bind="ctx">
      <Textarea v-bind="settings.textarea" class="f-data-form-textarea" />
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
      <Caption v-bind="settings.error" class="f-data-form-field-error">
        {{ error }}
      </Caption>
    </slot>
  </Group>
</template>
