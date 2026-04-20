<script lang="ts">
import { CheckboxRoot } from "reka-ui";
import type { CheckboxProps } from "../types/checkbox";
</script>

<script setup lang="ts">
const { disabled, name, value, required, pt } = defineProps<CheckboxProps>();

const model = defineModel<boolean | "indeterminate">();

const el = useTemplateRef("el");
defineExpose({ el });

const ctx = computed(() => ({ disabled, name, value, required, model: model.value }));
</script>

<template>
  <slot ref="el" name="root" v-bind="ctx">
    <CheckboxRoot
      v-model="model"
      :disabled="disabled"
      :name="name"
      :value="value"
      :required="required"
      v-bind="pt?.root"
      class="f-checkbox-root"
    >
      <slot name="indicator" v-bind="ctx">
        <Group v-bind="pt?.indicator" class="f-checkbox-indicator">
          <slot>
            <Icon :alias="model === 'indeterminate' ? 'minus' : 'check'" />
          </slot>
        </Group>
      </slot>
    </CheckboxRoot>
  </slot>
</template>

