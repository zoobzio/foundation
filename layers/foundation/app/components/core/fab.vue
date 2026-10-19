<script lang="ts">
import type {
  FabProps,
  FabEmits,
  FabContext,
  FabSlots,
} from "../../types/core/fab";

import { useTemplateRef } from "#imports";
import { useContext } from "../../composables/context";
</script>

<script setup lang="ts">
const { label, type = "button", disabled, badge } = defineProps<FabProps>();

const emit = defineEmits<FabEmits>();

const el = useTemplateRef<HTMLButtonElement>("el");

const ctx = useContext<FabContext>("fab", () => ({
  label,
  type,
  disabled,
  badge,
  el: el.value,
}));

defineExpose({ ctx });
defineSlots<FabSlots>();
</script>

<template>
  <button
    ref="el"
    :type="type"
    :disabled="disabled"
    :aria-label="label || undefined"
    class="f-button"
    @click="emit('click', $event)"
  >
    <slot name="icon" v-bind="ctx">
      <span v-if="label" class="f-span">{{ label }}</span>
    </slot>
    <slot name="badge" v-bind="ctx">
      <div v-if="badge !== undefined" class="f-group">
        {{ badge }}
      </div>
    </slot>
  </button>
</template>
