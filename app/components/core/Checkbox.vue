<script lang="ts">
import { CheckboxRoot } from "reka-ui";
import type { CheckboxProps, CheckboxEmits } from "#foundation/types/core/checkbox";
</script>

<script setup lang="ts">
import { computed, useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { passthrough } from "#foundation/utils/passthrough";
import Group from "#foundation/components/common/group.vue";
import Icon from "#foundation/components/common/icon.vue";
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
  <slot name="root" v-bind="ctx">
    <CheckboxRoot
      ref="el"
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
