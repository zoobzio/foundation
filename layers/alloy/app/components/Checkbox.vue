<script lang="ts">
import { CheckboxRoot } from "reka-ui";
import type { CheckboxProps, CheckboxEmits } from "../types/checkbox";
</script>

<script setup lang="ts">
const { disabled, name, value, required, pt } = defineProps<CheckboxProps>();
const emit = defineEmits<CheckboxEmits>();

const model = defineModel<boolean | "indeterminate">();

const el = useTemplateRef("el");
defineExpose({ el });

const rootPT = usePassthrough(pt?.root, {
  props: { disabled, name, value, required },
  handlers: { "update:modelValue": (v: boolean | "indeterminate") => emit("update:modelValue", v) },
});

const indicatorPT = usePassthrough(pt?.indicator, {});

const ctx = computed(() => ({ disabled, name, value, required, model: model.value }));
</script>

<template>
  <slot ref="el" name="root" v-bind="ctx">
    <CheckboxRoot
      v-model="model"
      v-bind="rootPT.props"
      v-on="rootPT.handlers"
      class="f-checkbox-root"
    >
      <slot name="indicator" v-bind="ctx">
        <Group v-bind="indicatorPT.props" v-on="indicatorPT.handlers" class="f-checkbox-indicator">
          <slot>
            <Icon :alias="model === 'indeterminate' ? 'minus' : 'check'" />
          </slot>
        </Group>
      </slot>
    </CheckboxRoot>
  </slot>
</template>
