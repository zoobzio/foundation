<script lang="ts">
import type { DataFormFieldProps } from "#foundation/types/data/form-field";
</script>

<script setup lang="ts" generic="T">
import { computed, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { passthrough } from "#foundation/utils/passthrough";
import Caption from "#foundation/components/common/caption.vue";
import Checkbox from "#foundation/components/core/Checkbox.vue";
import DatePicker from "#foundation/components/core/DatePicker.vue";
import Group from "#foundation/components/common/group.vue";
import Input from "#foundation/components/common/input.vue";
import Label from "#foundation/components/common/label.vue";
import MultiSelect from "#foundation/components/core/MultiSelect.vue";
import Radio from "#foundation/components/core/Radio.vue";
import Select from "#foundation/components/core/Select.vue";
import TagsInput from "#foundation/components/core/TagsInput.vue";
import Textarea from "#foundation/components/common/textarea.vue";
const { form, field, pt } = defineProps<DataFormFieldProps<T>>();

const el = useTemplateRef("el");
defineExpose({ el });

const key = String(field.key);

const value = computed(() => form.values.value[field.key]);
const error = computed(() => {
  if (!form.touched.value.has(key)) return undefined;
  return form.errors.value[key];
});
const hasError = computed(() => !!error.value);

const onUpdate = (v: unknown) => {
  form.setValue(field.key as keyof T, v as T[keyof T]);
};

const onBlur = () => {
  form.touch(field.key);
  form.validateField(field.key);
};

// Passthrough
const rootPT = usePassthrough(pt?.root, { props: {}, handlers: {} });
const labelPT = usePassthrough(pt?.label, { props: {}, handlers: {} });
const errorPT = usePassthrough(pt?.error, { props: {}, handlers: {} });
</script>

<template>
  <Group
    ref="el"
    v-bind="rootPT.props"
    class="f-data-form-field"
    :style="{ gridColumn: `span ${field.colspan ?? 12}` }"
    v-on="rootPT.handlers"
  >
    <Label
      v-bind="labelPT.props"
      class="f-data-form-field-label"
      v-on="labelPT.handlers"
    >
      {{ field.label }}
    </Label>

    <!-- text / email / password -->
    <Input
      v-if="field.type === 'text' || field.type === 'email' || field.type === 'password'"
      v-bind="passthrough(pt?.input, {
        props: {
          type: field.type,
          placeholder: field.placeholder,
          disabled: field.disabled,
          required: field.required,
          aria: { invalid: hasError },
        },
        handlers: {},
      }).props"
      :value="value as string"
      @input="onUpdate(($event.target as HTMLInputElement).value)"
      @blur="onBlur"
    />

    <!-- number -->
    <Input
      v-else-if="field.type === 'number'"
      v-bind="passthrough(pt?.input, {
        props: {
          type: 'number',
          placeholder: field.placeholder,
          disabled: field.disabled,
          required: field.required,
          aria: { invalid: hasError },
        },
        handlers: {},
      }).props"
      :value="value as string"
      :min="field.min"
      :max="field.max"
      :step="field.step"
      @input="onUpdate(Number(($event.target as HTMLInputElement).value))"
      @blur="onBlur"
    />

    <!-- textarea -->
    <Textarea
      v-else-if="field.type === 'textarea'"
      v-bind="passthrough(pt?.textarea, {
        props: {
          placeholder: field.placeholder,
          disabled: field.disabled,
          required: field.required,
          rows: field.rows,
          aria: { invalid: hasError },
        },
        handlers: {},
      }).props"
      :value="value as string"
      @input="onUpdate(($event.target as HTMLTextAreaElement).value)"
      @blur="onBlur"
    />

    <!-- select -->
    <Select
      v-else-if="field.type === 'select'"
      v-bind="passthrough(pt?.select, {
        props: {
          modelValue: value as string,
          options: field.options,
          placeholder: field.placeholder,
          disabled: field.disabled,
          required: field.required,
        },
        handlers: {},
      }).props"
      @update:model-value="onUpdate($event); onBlur()"
    />

    <!-- multi-select -->
    <MultiSelect
      v-else-if="field.type === 'multi-select'"
      v-bind="passthrough(pt?.multiSelect, {
        props: {
          modelValue: (value as string[]) ?? [],
          items: field.options,
          placeholder: field.placeholder,
          disabled: field.disabled,
        },
        handlers: {},
      }).props"
      @update:model-value="onUpdate($event); onBlur()"
    />

    <!-- checkbox -->
    <Checkbox
      v-else-if="field.type === 'checkbox'"
      v-bind="passthrough(pt?.checkbox, {
        props: {
          modelValue: (value as boolean) ?? false,
          disabled: field.disabled,
        },
        handlers: {},
      }).props"
      @update:model-value="onUpdate($event); onBlur()"
    />

    <!-- radio -->
    <Radio
      v-else-if="field.type === 'radio'"
      v-bind="passthrough(pt?.radio, {
        props: {
          modelValue: value as string,
          options: field.options,
          disabled: field.disabled,
          required: field.required,
          orientation: field.orientation,
        },
        handlers: {},
      }).props"
      @update:model-value="onUpdate($event); onBlur()"
    />

    <!-- date -->
    <DatePicker
      v-else-if="field.type === 'date'"
      v-bind="passthrough(pt?.datePicker, {
        props: {
          modelValue: value as undefined,
          placeholder: field.placeholder,
          disabled: field.disabled,
        },
        handlers: {},
      }).props"
      @update:model-value="onUpdate($event); onBlur()"
    />

    <!-- tags-input -->
    <TagsInput
      v-else-if="field.type === 'tags-input'"
      v-bind="passthrough(pt?.tagsInput, {
        props: {
          modelValue: (value as string[]) ?? [],
          placeholder: field.placeholder,
          disabled: field.disabled,
          max: field.max,
          delimiter: field.delimiter,
        },
        handlers: {},
      }).props"
      @update:model-value="onUpdate($event); onBlur()"
    />

    <Caption
      v-if="hasError"
      v-bind="errorPT.props"
      class="f-data-form-field-error"
      v-on="errorPT.handlers"
    >
      {{ error }}
    </Caption>
  </Group>
</template>
