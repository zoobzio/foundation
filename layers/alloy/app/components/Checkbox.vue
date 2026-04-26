<script lang="ts">
import { CheckboxRoot } from "reka-ui";
import type { CheckboxProps, CheckboxEmits } from "../types/checkbox";
</script>

<script setup lang="ts">
const { modelValue, disabled, name, value, required, pt } = defineProps<CheckboxProps>();
const emit = defineEmits<CheckboxEmits>();

const el = useTemplateRef("el");
defineExpose({ el });

const rootPT = usePassthrough(pt?.root, () => ({
  props: { modelValue, disabled, name, value, required },
  handlers: { "update:modelValue": (v: boolean | "indeterminate") => { emit("update:modelValue", v); } },
}));

const indicatorPT = usePassthrough(pt?.indicator, { props: {}, handlers: {} });
const iconPT = computed(() => passthrough(pt?.icon, {
  props: { alias: modelValue === "indeterminate" ? "minus" : "check" },
  handlers: {},
}));

const ctx = computed(() => ({ disabled, name, value, required, modelValue }));
</script>

<template>
  <slot ref="el" name="root" v-bind="ctx">
    <CheckboxRoot
      v-bind="rootPT.props"
      class="f-checkbox-root"
      v-on="rootPT.handlers"
    >
      <slot name="indicator" v-bind="ctx">
        <Group v-bind="indicatorPT.props" class="f-checkbox-indicator" v-on="indicatorPT.handlers">
          <slot name="icon" v-bind="ctx">
            <Icon v-bind="iconPT.props" v-on="iconPT.handlers" />
          </slot>
        </Group>
      </slot>
    </CheckboxRoot>
  </slot>
</template>
