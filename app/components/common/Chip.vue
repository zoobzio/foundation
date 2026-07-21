<script lang="ts">
import type { ChipProps } from "#foundation/types/common/chip";
import { useTemplateRef } from "#imports";
import Icon from "#foundation/components/common/Icon.vue";
</script>

<script setup lang="ts">
const { label, closable, disabled, ariaPressed, ariaSelected } = defineProps<ChipProps>();

const el = useTemplateRef("el");
defineExpose({ el });
</script>

<template>
  <button ref="el" type="button" :aria-label="label" :aria-pressed="ariaPressed" :aria-selected="ariaSelected" :disabled="disabled" :data-closable="closable || undefined" class="f-chip">
    <slot>{{ label }}</slot>
    <Icon v-if="closable" alias="close" class="f-chip-close" />
  </button>
</template>
