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
const {
  icon,
  label,
  type = "button",
  disabled,
  badge,
} = defineProps<FabProps>();

const emit = defineEmits<FabEmits>();

const el = useTemplateRef<HTMLButtonElement>("el");

const ctx = useContext<FabContext>("fab", () => ({
  icon,
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
      <Icon v-if="icon" class="f-icon" fill="currentColor" :name="icon" />
    </slot>
    <slot name="badge" v-bind="ctx">
      <div v-if="badge !== undefined" class="f-group">
        {{ badge }}
      </div>
    </slot>
  </button>
</template>
