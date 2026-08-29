<script lang="ts">
import type {
  CheckboxProps,
  CheckboxEmits,
  CheckboxPassthrough,
  CheckboxContext,
  CheckboxSlots,
} from "../../types/core/checkbox";
import type { ComponentPublicInstance } from "vue";

import { CheckboxRoot } from "reka-ui";

import { useTemplateRef } from "#imports";
import { usePassthrough } from "../../composables/passthrough";
import { useModel } from "../../composables/model";
import { useContext } from "../../composables/context";
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
  <CheckboxRoot ref="el" class="f-checkbox-root" v-bind="settings.root">
    <slot name="indicator" v-bind="ctx">
      <div class="f-group">
        <slot name="icon" v-bind="ctx">
          <Icon
            class="f-icon"
            fill="currentColor"
            :name="$model === 'indeterminate' ? 'minus' : 'check'"
          />
        </slot>
      </div>
    </slot>
  </CheckboxRoot>
</template>
