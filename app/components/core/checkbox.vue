<script lang="ts">
import type {
  CheckboxProps,
  CheckboxEmits,
  CheckboxPassthrough,
  CheckboxContext,
  CheckboxSlots,
} from "#foundation/types/core/checkbox";
import type { ComponentPublicInstance } from "vue";

import CheckboxRoot from "#foundation/components/common/checkbox/root.vue";
import Group from "#foundation/components/common/group.vue";
import Icon from "#foundation/components/common/icon.vue";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "#foundation/composables/passthrough";
import { useModel } from "#foundation/composables/model";
import { useContext } from "#foundation/composables/context";
</script>

<script setup lang="ts">
const {
  modelValue = undefined,
  disabled,
  name,
  value,
  required,
  pt,
} = defineProps<CheckboxProps>();

const emit = defineEmits<CheckboxEmits>();

const $model = useModel(
  () => modelValue,
  (v) => emit("update:modelValue", v),
);

const el = useTemplateRef<ComponentPublicInstance>("el");

const settings = usePassthrough<CheckboxPassthrough>(() => ({
  pt,
  recipes: {
    root: {
      modelValue: $model.value,
      disabled,
      name,
      value,
      required,
      "onUpdate:modelValue": (v) => {
        $model.value = v;
      },
    },
    indicator: {},
    icon: {
      alias: $model.value === "indeterminate" ? "minus" : "check",
    },
  },
}));

const ctx = useContext<CheckboxContext>("checkbox", () => ({
  disabled,
  name,
  value,
  required,
  modelValue: $model,
  el: el.value,
  settings: settings.value,
}));

defineExpose({ ctx });
defineSlots<CheckboxSlots>();
</script>

<template>
  <CheckboxRoot ref="el" v-bind="settings.root">
    <slot name="indicator" v-bind="ctx">
      <Group v-bind="settings.indicator">
        <slot name="icon" v-bind="ctx">
          <Icon v-bind="settings.icon" />
        </slot>
      </Group>
    </slot>
  </CheckboxRoot>
</template>
